import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Search, ShoppingCart, CreditCard, Banknote, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { RetailerInventoryItem } from '../types';

interface CartItem extends RetailerInventoryItem {
    cartQty: number;
}

const Billing = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [inventory, setInventory] = useState<RetailerInventoryItem[]>([]);
    const [filteredInventory, setFilteredInventory] = useState<RetailerInventoryItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    
    // Approval Modal State
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [approvalPin, setApprovalPin] = useState('');
    const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

    useEffect(() => {
        client.get('/api/inventory').then(res => {
            setInventory(res.data);
            setFilteredInventory(res.data);
        });
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredInventory(inventory);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredInventory(inventory.filter(i => 
                (i.custom_name || i.master_catalog?.name || '').toLowerCase().includes(lower) ||
                (i.sku || '').toLowerCase().includes(lower)
            ));
        }
    }, [searchTerm, inventory]);

    const addToCart = (item: RetailerInventoryItem) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === item.id);
            if (existing) {
                if (existing.cartQty >= item.quantity) {
                    toast.error('Insufficient Stock');
                    return prev;
                }
                return prev.map(p => p.id === item.id ? { ...p, cartQty: p.cartQty + 1 } : p);
            }
            return [...prev, { ...item, cartQty: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.cartQty + delta;
                if (newQty < 1) return item;
                if (newQty > item.quantity) {
                    toast.error('Max stock reached');
                    return item;
                }
                return { ...item, cartQty: newQty };
            }
            return item;
        }));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);

    const handleCashPayment = async () => {
        // Validation: If staff, need proof
        if (user?.role === 'viewer') { 
            // Trigger Manager Approval
            toast('Manager Approval Required for Cash', { icon: '🔒' });
            setPendingAction(() => processCashPayment);
            setIsApprovalOpen(true);
            return;
        }
        await processCashPayment();
    };

    const processCashPayment = async (managerId?: string) => {
        try {
            const payload = {
                retailer_id: user?.id, // Assumes currently logged in user belongs to retailer
                items: cart.map(i => ({ id: i.id, qty: i.cartQty, price: i.price })),
                manager_pin: approvalPin, // If passed
                manager_id: managerId
            };
            
            await client.post('/payment/offline', payload);
            toast.success('Cash Sale Recorded!');
            setCart([]);
            setIsApprovalOpen(false);
            setApprovalPin('');
            // Refresh inventory ??
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Payment Failed');
        }
    };

    const handleOnlinePayment = async () => {
        try {
            // 1. Create Order
            const { data: order } = await client.post('/payment/create-order', { amount: totalAmount });

            // 2. Open Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Frontend Env Var
                amount: order.amount,
                currency: order.currency,
                name: "Retail Inventory Shop",
                description: "POS Transaction",
                order_id: order.id,
                handler: async (response: any) => {
                    // 3. Verify
                    try {
                        await client.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            items: cart.map(i => ({ id: i.id, qty: i.cartQty, price: i.price })),
                            retailer_id: user?.id
                        });
                        toast.success('Payment Successful!');
                        setCart([]);
                    } catch (e) {
                        toast.error('Verification Failed');
                    }
                },
                theme: { color: "#3b82f6" }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error('Could not initiate payment');
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex gap-6">
            {/* Left: Product Catalog */}
            <div className="flex-1 flex flex-col space-y-4">
                <h1 className="text-3xl font-bold">Billing & POS</h1>
                <Card className="p-4 flex gap-2">
                    <Search className="text-slate-500" />
                    <input 
                        className="bg-transparent outline-none w-full text-white"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </Card>
                
                <div className="flex-1 overflow-auto grid grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                    {filteredInventory.map(item => (
                        <Card 
                            key={item.id} 
                            className="p-4 cursor-pointer hover:border-blue-500 transition-colors flex flex-col justify-between"
                            onClick={() => addToCart(item)}
                        >
                            <div>
                                <h3 className="font-bold text-white truncate">{item.custom_name || item.master_catalog?.name}</h3>
                                <p className="text-slate-400 text-sm">{item.sku}</p>
                            </div>
                            <div className="mt-4 flex justify-between items-end">
                                <span className="text-emerald-400 font-bold">${item.price}</span>
                                <span className={`text-xs px-2 py-1 rounded ${item.quantity > 0 ? 'bg-slate-700' : 'bg-red-900 text-red-200'}`}>
                                    Qty: {item.quantity}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right: Cart */}
            <Card className="w-96 flex flex-col border-l border-slate-700 rounded-none h-full fixed right-0 top-16 bottom-0 md:relative md:top-auto md:h-auto z-10">
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart /> Current Bill
                    </h2>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-slate-800 p-2 rounded">
                            <div className="flex-1">
                                <p className="font-medium text-sm text-white">{item.custom_name || item.master_catalog?.name}</p>
                                <p className="text-xs text-slate-500">${item.price} x {item.cartQty}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-slate-700 rounded"><Minus size={14}/></button>
                                <span className="text-sm font-bold w-4 text-center">{item.cartQty}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-slate-700 rounded"><Plus size={14}/></button>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-1"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && <p className="text-center text-slate-500 mt-10">Cart is empty</p>}
                </div>

                <div className="p-4 border-t border-slate-700 bg-slate-900/50 space-y-4">
                    <div className="flex justify-between text-xl font-bold text-white">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <Button variant="secondary" onClick={handleCashPayment} disabled={cart.length===0} className="w-full">
                            <Banknote className="mr-2" size={18}/> Cash
                         </Button>
                         <Button onClick={handleOnlinePayment} disabled={cart.length===0} className="w-full bg-blue-600 hover:bg-blue-700">
                            <CreditCard className="mr-2" size={18}/> Online
                         </Button>
                    </div>
                </div>
            </Card>

            {/* Manager Approval Modal */}
            <Modal isOpen={isApprovalOpen} onClose={() => setIsApprovalOpen(false)} title="Manager Approval Required">
                <div className="space-y-4">
                    <div className="bg-amber-500/10 text-amber-500 p-3 rounded text-sm">
                        Cash transactions by staff require manager Authorization.
                    </div>
                    <Input 
                        type="password" 
                        placeholder="Enter Manager PIN (Demo: 1234)" 
                        value={approvalPin}
                        onChange={e => setApprovalPin(e.target.value)}
                    />
                    <Button 
                        className="w-full" 
                        onClick={() => {
                            if (pendingAction) pendingAction();
                        }}
                    >
                        Authorize & Print
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Billing;
