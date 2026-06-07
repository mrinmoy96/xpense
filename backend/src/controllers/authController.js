const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const respond = (res, statusCode, user) => {
  const token = signToken(user._id);
  res.status(statusCode).json({ success: true, token, user });
};

// ── POST /api/auth/register ───────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email is already registered.' });

    const user = await User.create({ name, email, password });
    respond(res, 201, user);
  } catch (err) { next(err); }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    respond(res, 200, user);
  } catch (err) { next(err); }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────
exports.getMe = (req, res) =>
  res.json({ success: true, user: req.user });

// ── PUT /api/auth/profile ─────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'currency', 'avatar'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    );

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// ── PUT /api/auth/change-password ─────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();

    respond(res, 200, user);
  } catch (err) { next(err); }
};
