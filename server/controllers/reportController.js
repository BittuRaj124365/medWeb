import Report from '../models/Report.js';
import Medicine from '../models/Medicine.js';

// @desc  Submit a product report (public)
// @route POST /api/medicines/:id/report
// @access Public
export const submitReport = async (req, res) => {
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

// @desc  Get all product reports (admin)
// @route GET /api/admin/product-reports
// @access Private (Admin)
export const getProductReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('medicine', 'name category')
      .sort('-dateReported');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc  Get count of pending (unreviewed) reports
// @route GET /api/admin/product-reports/count
// @access Private (Admin)
export const getUnreviewedCount = async (req, res) => {
  try {
    const count = await Report.countDocuments({ status: 'pending' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc  Update report status (admin)
// @route PUT /api/admin/product-reports/:id
// @access Private (Admin)
export const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('medicine', 'name');
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (req.body.status) {
      report.status = req.body.status;
    }
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc  Delete a report (admin)
// @route DELETE /api/admin/product-reports/:id
// @access Private (Admin)
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
