const db = require('../config/db');

// @desc    Register a new user (Job Seeker or Employer)
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, company, title, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    // Check duplicate
    const existing = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const assignedRole = role === 'employer' ? 'employer' : 'seeker';
    const fakeHash = `hash_${Date.now()}`;

    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, role, company, title, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, fakeHash, assignedRole, company || '', title || '', location || '']
    );

    const user = {
      id: result.insertId,
      name,
      email,
      role: assignedRole,
      company: company || '',
      title: title || '',
      location: location || ''
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token: `token_for_user_${user.id}`,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User does not exist.'
      });
    }

    const user = users[0];
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Logged in successfully',
      token: `token_for_user_${user.id}`,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const userId = req.query.userId || 3; // Default demo seeker: Priyanshu Kumar
    const users = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = users[0];
    delete user.password_hash;
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
