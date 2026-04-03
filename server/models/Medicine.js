import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, required: true, min: 0 }
});

const restockSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  quantityAdded: { type: Number, required: true },
  restockedBy: { type: String, required: true }
});

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: { type: String, default: '' },
  manufacturer: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 'Drops', 'Vitamins', 'Other'],
    default: 'Other'
  },
  price: { type: Number, required: true }, // Selling price
  purchasePrice: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  
  // Inventory Management
  stockQuantity: { type: Number, required: true },
  minStockThreshold: { type: Number, default: 5 },
  restockHistory: [restockSchema],
  
  // Expiry & Batch Management
  expiryDate: { type: Date },
  batchNumber: { type: String, default: '' },
  batches: [batchSchema],

  // Supplier Management
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  lastSuppliedDate: { type: Date },

  // Lifecycle Tracking
  dateAdded: { type: Date, default: Date.now },
  lastUpdated: { type: Date },
  outOfStockDate: { type: Date },

  // Rating and Feedback
  totalRatingCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  
  // Reporting / Metrics
  viewCount: { type: Number, default: 0 },
  searchCount: { type: Number, default: 0 },

  description: { type: String, default: '' },
  usageInstructions: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-derive isAvailable and manage lifecycle dates before saving
medicineSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  const currentDate = new Date();
  
  // Set out of stock date if stock reaches 0
  if (this.stockQuantity <= 0 && this.isModified('stockQuantity')) {
      if (!this.outOfStockDate) {
          this.outOfStockDate = currentDate;
      }
  } else if (this.stockQuantity > 0) {
      this.outOfStockDate = undefined;
  }

  // Determine availability based on stock and expiry
  let available = this.stockQuantity > 0;
  
  if (this.expiryDate && this.expiryDate < currentDate) {
      available = false; // Expired
  }

  this.isAvailable = available;
  
  next();
});

export default mongoose.model('Medicine', medicineSchema);
