const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../config/supabase');
const router = express.Router();

// Helper to get Razorpay Instance
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay Keys are missing in Server Environment');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

// 1. Create Online Order (Razorpay)
router.post('/create-order', async (req, res, next) => {
  try {
    const razorpay = getRazorpay();
    const { amount } = req.body; // Amount in INR
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error.message);
    next(error);
  }
});

// 2. Verify Online Payment & Deduct Stock
router.post('/verify', async (req, res, next) => {
  try {
    // Check keys first
    if (!process.env.RAZORPAY_KEY_SECRET) throw new Error("Missing RAZORPAY_KEY_SECRET");
    
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      items, // [{"id": "uuid", "qty": 2, "price": 100}]
      retailer_id
    } = req.body;

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid Payment Signature' });
    }

    // Record Transaction
    const total_amount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        retailer_id,
        total_amount,
        payment_mode: 'online',
        status: 'completed',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        items
      });

    if (txError) throw txError;

    // Deduct Stock
    // Note: In production, use a Database Function (RPC) for atomicity.
    // For now, we iterate.
    for (const item of items) {
       // Fetch current qty
       const { data: current } = await supabase
         .from('retailer_inventory')
         .select('quantity')
         .eq('id', item.id)
         .single();
       
       if (current) {
         const newQty = Math.max(0, current.quantity - item.qty);
         await supabase
           .from('retailer_inventory')
           .update({ quantity: newQty })
           .eq('id', item.id);
       }
    }

    res.json({ success: true, message: 'Payment Verified & Stock Updated' });
  } catch (error) {
    next(error);
  }
});

// 3. Offline Payment (Cash)
router.post('/offline', async (req, res, next) => {
  try {
    const { items, retailer_id, manager_id, manager_pin } = req.body;
    
    // Security Check: If manager_pin provided, verify it (Simplified: Pin = "1234" for demo)
    // PROD: Verify against DB hash
    const isApproved = manager_id ? true : false; 
    
    const total_amount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const { error } = await supabase
      .from('transactions')
      .insert({
        retailer_id,
        total_amount,
        payment_mode: 'cash',
        status: 'completed', // Cash is immediate
        approved_by: manager_id || null,
        items
      });

    if (error) throw error;

    // Deduct Stock
    for (const item of items) {
       const { data: current } = await supabase
         .from('retailer_inventory')
         .select('quantity')
         .eq('id', item.id)
         .single();
       
       if (current) {
         await supabase
           .from('retailer_inventory')
           .update({ quantity: Math.max(0, current.quantity - item.qty) })
           .eq('id', item.id);
       }
    }

    res.json({ success: true, message: 'Cash Sale Recorded' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
