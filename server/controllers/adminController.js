import Admin from '../models/Admin.js';
import Medicine from '../models/Medicine.js';
import Supplier from '../models/Supplier.js';
import AdminActivityLog from '../models/AdminActivityLog.js';
import Feedback from '../models/Feedback.js';
import Report from '../models/Report.js';
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

// @desc Update admin account settings (Name, Email, Passwords, Username, Picture)
// @route PUT /api/admin/profile
// @access Private (Admin)
export const updateProfile = async (req, res) => {
  const { name, email, newUsername, currentPassword, newPassword } = req.body;
  
  try {
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Email is no longer updated here directly. It requires the OTP flow via /auth/verify-email-change.

    // Checking current password if they try to update password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
         return res.status(401).json({ message: 'Current password is incorrect' });
      }
      admin.password = newPassword;
    }

    if (name) admin.name = name;
    if (newUsername) admin.username = newUsername;
    
    // Construct local path URL if file uploaded
    if (req.file) {
      // Return full URL so frontend can reflect immediately
      const protocol = req.protocol;
      const host = req.get('host');
      admin.profilePicture = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    await admin.save();

    // Re-issue token using sign just in case username or id implications change
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });

    res.json({
      message: 'Account settings updated successfully',
      _id: admin._id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      profilePicture: admin.profilePicture,
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or Username already exists' });
    }
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
    const mostLiked = await Medicine.find().sort({ likes: -1 }).limit(10);

    const expiredOrNearExpiry = await Medicine.find({
      expiryDate: { $lte: ninetyDaysFromNow }
    }).sort({ expiryDate: 1 });

    const totalFeedbacks = await Feedback.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();

    res.json({
      stockReport: { 
        totalMedicines, 
        lowStockCount: lowStockMedicines.length, 
        outOfStockCount: outOfStock 
      },
      totalFeedbacks,
      totalReports,
      totalSuppliers,
      lowStock: lowStockMedicines,
      mostSearched,
      mostViewed,
      mostLiked,
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

// @desc    Get data for dashboard graphs
// @route   GET /api/admin/dashboard/graphs
// @access  Private (Admin)
export const getDashboardGraphs = async (req, res) => {
  try {
    // 1. Medicine Stock Overview (by category)
    const stockByCategory = await Medicine.aggregate([
      { $group: { _id: '$category', count: { $sum: '$stockQuantity' } } },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]);

    // 2. Most Viewed Medicines (Top 10)
    const mostViewed = await Medicine.find().sort({ viewCount: -1 }).limit(10).select('name viewCount');

    // 3. Most Searched Medicines (Top 10)
    const mostSearched = await Medicine.find().sort({ searchCount: -1 }).limit(10).select('name searchCount');

    // 4. Feedback Ratings Distribution
    const ratingsDistribution = await Feedback.aggregate([
      { $match: { approved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const ratingsData = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: ratingsDistribution.find(r => r._id === star)?.count || 0
    }));

    // 5. Reports Overview (by status)
    const reportsStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 6. Monthly Activity (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyActivity = await Medicine.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const activityData = monthlyActivity.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count
    }));

    res.json({
      stockByCategory,
      mostViewed,
      mostSearched,
      ratingsData,
      reportsStatus: reportsStatus.map(r => ({ status: r._id, count: r.count })),
      monthlyActivity: activityData
    });
  } catch (error) {
    console.error('getDashboardGraphs error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all medicines for admin with search/filter/pagination
// @route   GET /api/admin/medicines
// @access  Private (Admin)
export const getMedicines = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.q ? {
      $or: [
        { name: { $regex: req.query.q, $options: 'i' } },
        { genericName: { $regex: req.query.q, $options: 'i' } },
        { manufacturer: { $regex: req.query.q, $options: 'i' } },
        { batchNumber: { $regex: req.query.q, $options: 'i' } }
      ]
    } : {};

    const filter = { ...keyword };
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    const count = await Medicine.countDocuments(filter);
    const medicines = await Medicine.find(filter)
      .populate('supplier', 'name')
      .sort('-createdAt')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json(medicines); // Frontend expects an array based on current implementation
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
