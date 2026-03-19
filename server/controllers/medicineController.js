import Medicine from '../models/Medicine.js';

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
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
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
      const updatedMedicine = await medicine.save();
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
      await medicine.deleteOne();
      res.json({ message: 'Medicine removed' });
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
