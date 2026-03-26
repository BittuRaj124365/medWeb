import Admin from '../models/Admin.js';
import Medicine from '../models/Medicine.js';
import Supplier from '../models/Supplier.js';
import AdminActivityLog from '../models/AdminActivityLog.js';
import Feedback from '../models/Feedback.js';
import jwt from 'jsonwebtoken';

// Auth logic moved to authController.js

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

    // Re-issue token using sign to avoid importing generateToken
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });

    res.json({
      message: 'Credentials updated successfully',
      username: admin.username,
      name: admin.name,
      profilePicture: admin.profilePicture,
      token,
    });
  } catch (error) {
    console.error('updateCredentials error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Update admin profile info (Name + Picture)
// @route PUT /api/admin/profile
// @access Private (Admin)
export const updateProfile = async (req, res) => {
  const { name } = req.body;
  
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (name) admin.name = name;
    
    // Construct local path URL if file uploaded
    if (req.file) {
      // Create a URL pointing to the static uploads folder
      admin.profilePicture = `/uploads/${req.file.filename}`;
    }

    await admin.save();

    res.json({
      message: 'Profile updated successfully',
      _id: admin._id,
      username: admin.username,
      name: admin.name,
      profilePicture: admin.profilePicture
    });
  } catch (error) {
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

// @desc    Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort('-createdAt');
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(supplier) res.json(supplier);
    else res.status(404).json({ message: 'Supplier not found' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if(supplier) res.json({ message: 'Supplier removed' });
    else res.status(404).json({ message: 'Supplier not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Get Admin Logs
export const getAdminLogs = async (req, res) => {
  try {
    const logs = await AdminActivityLog.find().sort('-timestamp').limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Get Reports
export const getReports = async (req, res) => {
  try {
    const currentDate = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(currentDate.getDate() + 90);

    const totalMedicines = await Medicine.countDocuments();
    const outOfStock = await Medicine.countDocuments({ stockQuantity: 0 });
    
    // Low stock where stock > 0 but <= minStockThreshold
    const lowStockMedicines = await Medicine.find({
      $expr: {
        $and: [
          { $gt: ["$stockQuantity", 0] },
          { $lt: ["$stockQuantity", "$minStockThreshold"] }
        ]
      }
    });

    const mostSearched = await Medicine.find().sort({ searchCount: -1 }).limit(10);
    const mostViewed = await Medicine.find().sort({ viewCount: -1 }).limit(10);

    const expiredOrNearExpiry = await Medicine.find({
      expiryDate: { $lte: ninetyDaysFromNow }
    }).sort({ expiryDate: 1 });

    res.json({
      stockReport: { totalMedicines, lowStockCount: lowStockMedicines.length, outOfStockCount: outOfStock },
      lowStock: lowStockMedicines,
      mostSearched,
      mostViewed,
      expiredOrNearExpiry
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Get all feedbacks
export const getFeedbacks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.medicineId) filter.medicine = req.query.medicineId;
    if (req.query.rating) filter.rating = req.query.rating;
    if (req.query.approved !== undefined) filter.approved = req.query.approved === 'true';

    const feedbacks = await Feedback.find(filter).populate('medicine', 'name').sort('-dateSubmitted');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if(feedback) {
      if(req.body.approved !== undefined) {
        feedback.approved = req.body.approved;
        await feedback.save();

        // Recalculate medicine rating
        const medFeedbacks = await Feedback.find({ medicine: feedback.medicine, approved: true });
        const med = await Medicine.findById(feedback.medicine);
        if(med) {
            med.totalRatingCount = medFeedbacks.length;
            med.averageRating = medFeedbacks.length > 0 ? (medFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / medFeedbacks.length) : 0;
            await med.save();
        }

        // Log
        await AdminActivityLog.create({
          actionType: req.body.approved ? 'APPROVE_FEEDBACK' : 'REJECT_FEEDBACK',
          medicineName: med ? med.name : 'Unknown',
          adminUsername: req.admin.username
        });
      }
      res.json(feedback);
    } else {
      res.status(404).json({ message: 'Feedback not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if(feedback) {
      const medId = feedback.medicine;
      await feedback.deleteOne();

      // Recalculate medicine rating
      const medFeedbacks = await Feedback.find({ medicine: medId, approved: true });
      const med = await Medicine.findById(medId);
      if(med) {
          med.totalRatingCount = medFeedbacks.length;
          med.averageRating = medFeedbacks.length > 0 ? (medFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / medFeedbacks.length) : 0;
          await med.save();
      }

      await AdminActivityLog.create({
        actionType: 'DELETE_FEEDBACK',
        medicineName: med ? med.name : 'Unknown',
        adminUsername: req.admin.username
      });

      res.json({ message: 'Feedback removed' });
    } else {
       res.status(404).json({ message: 'Feedback not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
