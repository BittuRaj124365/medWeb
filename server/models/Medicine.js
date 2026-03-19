import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: { type: String, default: '' },
  manufacturer: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 'Drops', 'Vitamins', 'Other'],
    default: 'Other'
  },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  stockQuantity: { type: Number, required: true },
  expiryDate: { type: Date },
  description: { type: String, default: '' },
  usageInstructions: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  isAvailable: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-derive isAvailable before saving
medicineSchema.pre('save', function(next) {
  this.isAvailable = this.stockQuantity > 0;
  next();
});

export default mongoose.model('Medicine', medicineSchema);
