const supabase = require('../config/supabase');
const Joi = require('joi');

const signup = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    role: Joi.string().valid('admin', 'manager', 'viewer').default('manager')
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password, name, role } = req.body;

  try {
    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto confirm for simplicity in this demo, usually false
    });

    if (authError) {
       // If using client side signup (supabase.auth.signUp), we can't set confirm true without service role. 
       // Since we are backend, we use admin.createUser or standard signUp.
       // Let's try standard signUp first, but auto-confirm is tricky.
       // Actually, using admin.createUser is better for backend-controlled user creation.
       throw new Error(authError.message);
    }
    
    const user = authData.user;

    // 2. Create public profile
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        { id: user.id, email, name, role }
      ]);

    if (profileError) {
       await supabase.auth.admin.deleteUser(user.id);
       throw new Error(profileError.message);
    }

    // 3. Create Retailer Profile (Private DB Link)
    // Every user is a retailer in this system for now
    const { error: retailerError } = await supabase
        .from('retailers')
        .insert([
            { id: user.id, shop_name: `${name}'s Shop` }
        ]);

    if (retailerError) {
        console.error('Failed to create retailer profile:', retailerError);
        // non-blocking for now, can be fixed manually or via trigger
    }

    res.status(201).json({ message: 'User created successfully', user: { id: user.id, email, name, role } });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and Password are required' });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    // Fetch public profile (name, role)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw new Error('Failed to fetch user profile');

    res.json({
      message: 'Login successful',
      session: data.session,
      user: {
        ...data.user,
        name: profile.name,
        role: profile.role
      }
    });

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = { signup, login };
