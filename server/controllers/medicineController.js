import Medicine from '../models/Medicine.js';
import AdminActivityLog from '../models/AdminActivityLog.js';
import Feedback from '../models/Feedback.js';
import Report from '../models/Report.js';

// @desc    Get all medicines (public) with pagination, filter, search
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    // Filtering
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.availability === 'in-stock') filter.stockQuantity = { $gt: 0 };
    if (req.query.availability === 'out-of-stock') filter.stockQuantity = 0;

    // Sorting
    let sort = {};
    if (req.query.sort === 'price-asc') sort.price = 1;
    else if (req.query.sort === 'price-desc') sort.price = -1;
    else if (req.query.sort === 'name-asc') sort.name = 1;
    else if (req.query.sort === 'name-desc') sort.name = -1;
    else sort.createdAt = -1; // default

    const count = await Medicine.countDocuments(filter);
    const medicines = await Medicine.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ medicines, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('supplier', 'name email contactNumber');
    if (medicine) {
      medicine.viewCount = (medicine.viewCount || 0) + 1;
      await medicine.save();
      res.json(medicine);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Search medicines (live search)
// @route   GET /api/medicines/search?q=
// @access  Public
export const searchMedicines = async (req, res) => {
  try {
    const keyword = req.query.q ? {
      $or: [
        { name: { $regex: req.query.q, $options: 'i' } },
        { manufacturer: { $regex: req.query.q, $options: 'i' } },
        { genericName: { $regex: req.query.q, $options: 'i' } }
      ]
    } : {};

    const medicines = await Medicine.find(keyword).limit(10);

    if (req.query.q && medicines.length > 0) {
      await Medicine.updateMany(
        { _id: { $in: medicines.map(m => m._id) } },
        { $inc: { searchCount: 1 } }
      );
    }

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a medicine
// @route   POST /api/admin/medicines
// @access  Private (Admin)
export const createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const createdMedicine = await medicine.save();

    await AdminActivityLog.create({
      actionType: 'ADD',
      medicineName: createdMedicine.name,
      adminUsername: req.admin.username
    });

    res.status(201).json(createdMedicine);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update a medicine
// @route   PUT /api/admin/medicines/:id
// @access  Private (Admin)
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
      Object.assign(medicine, req.body);

      // Stock updates - tracking restocks
      if (req.body.restockQuantity && Number(req.body.restockQuantity) > 0) {
        medicine.stockQuantity += Number(req.body.restockQuantity);
        medicine.restockHistory.push({
          quantityAdded: Number(req.body.restockQuantity),
          restockedBy: req.admin.username
        });
      }

      const updatedMedicine = await medicine.save();

      await AdminActivityLog.create({
        actionType: 'EDIT',
        medicineName: updatedMedicine.name,
        adminUsername: req.admin.username
      });

      res.json(updatedMedicine);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete a medicine
// @route   DELETE /api/admin/medicines/:id
// @access  Private (Admin)
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
      const name = medicine.name;
      await medicine.deleteOne();

      await AdminActivityLog.create({
        actionType: 'DELETE',
        medicineName: name,
        adminUsername: req.admin.username
      });

      res.json({ message: 'Medicine removed' });
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const addFeedback = async (req, res) => {
  const { userName, userEmail, rating, message } = req.body;
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    const feedback = await Feedback.create({
      medicine: medicine._id,
      userName,
      userEmail,
      rating: Number(rating),
      message
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: 'Invalid feedback data', error: error.message });
  }
};

export const getMedicineFeedbacks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const query = { medicine: req.params.id, approved: true };
    const count = await Feedback.countDocuments(query);
    
    // Calculate rating distribution for all approved feedbacks of this medicine
    const allApprovedFeedbacks = await Feedback.find(query).select('rating');
    const ratingStats = allApprovedFeedbacks.reduce((acc, fb) => {
      acc[fb.rating] = (acc[fb.rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    const feedbacks = await Feedback.find(query)
      .sort('-dateSubmitted')
      .limit(limit)
      .skip(skip);

    res.json({
      feedbacks,
      page,
      pages: Math.ceil(count / limit),
      total: count,
      hasMore: count > skip + feedbacks.length,
      ratingStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getShopRatingStats = async (req, res) => {
  try {
    const approvedFeedbacks = await Feedback.find({ approved: true })
      .populate('medicine', 'name')
      .sort('-dateSubmitted');

    const totalReviews = approvedFeedbacks.length;

    let averageRating = 0;
    let starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (totalReviews > 0) {
      let sum = 0;
      approvedFeedbacks.forEach(fb => {
        sum += fb.rating;
        starCounts[fb.rating] = (starCounts[fb.rating] || 0) + 1;
      });
      averageRating = sum / totalReviews;
    }

    const recentReviews = approvedFeedbacks.slice(0, 3); // Get 3 most recent

    res.json({
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
      starCounts,
      recentReviews
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all approved feedbacks with pagination
// @route   GET /api/medicines/feedbacks/approved
// @access  Public
export const getApprovedFeedbacks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const count = await Feedback.countDocuments({ approved: true });
    const feedbacks = await Feedback.find({ approved: true })
      .populate('medicine', 'name')
      .sort('-dateSubmitted')
      .limit(limit)
      .skip(skip);

    res.json({
      feedbacks,
      page,
      pages: Math.ceil(count / limit),
      total: count,
      hasMore: count > skip + feedbacks.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Like a medicine
// @route   POST /api/medicines/:id/like
// @access  Public
export const likeMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    medicine.likes = (medicine.likes || 0) + 1;
    await medicine.save();

    res.json({ likes: medicine.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Unlike a medicine
// @route   POST /api/medicines/:id/unlike
// @access  Public
export const unlikeMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    medicine.likes = Math.max(0, (medicine.likes || 0) - 1);
    await medicine.save();

    res.json({ likes: medicine.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a product report
// @route   POST /api/medicines/:id/report
// @access  Public
export const addReport = async (req, res) => {
  const { reason, additionalDetails, reporterName, reporterEmail } = req.body;
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

    if (!reason) {
      return res.status(400).json({ message: 'Please select a reason for the report' });
    }

    const report = await Report.create({
      medicine: medicine._id,
      reason,
      additionalDetails: additionalDetails || '',
      reporterName: reporterName || '',
      reporterEmail: reporterEmail || ''
    });

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
