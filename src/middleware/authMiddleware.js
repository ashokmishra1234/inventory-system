const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }

      // Fetch user profile from public.users table to get role
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
         // Fallback if profile doesn't exist yet but auth is valid (shouldn't happen with correct flow)
         req.user = { ...user, role: 'viewer' };
      } else {
         req.user = { ...user, ...profile };
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const manager = (req, res, next) => {
    if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as a manager' });
    }
  };

module.exports = { protect, admin, manager };
