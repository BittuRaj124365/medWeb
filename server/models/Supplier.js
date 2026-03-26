import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema);
