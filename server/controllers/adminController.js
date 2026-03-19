import Admin from '../models/Admin.js';
import Medicine from '../models/Medicine.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
export const authAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update admin credentials
// @route   PUT /api/admin/credentials
// @access  Private (Admin)
export const updateCredentials = async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ message: 'Current password is required' });
  }

  try {
    // Fetch admin WITH password field (auth middleware omits it)
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    if (!newUsername && !newPassword) {
      return res.status(400).json({ message: 'Provide at least a new username or password' });
    }

    if (newUsername) admin.username = newUsername;
    if (newPassword) admin.password = newPassword;

    await admin.save();

    // Issue a fresh token so the session stays valid after username change
    const token = generateToken(admin._id);

    res.json({
      message: 'Credentials updated successfully',
      username: admin.username,
      token,
    });
  } catch (error) {
    console.error('updateCredentials error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments();
    const outOfStock = await Medicine.countDocuments({ stockQuantity: 0 });
    const lowStock = await Medicine.countDocuments({ stockQuantity: { $gt: 0, $lt: 10 } });

    res.json({
      totalMedicines,
      outOfStock,
      lowStock
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
