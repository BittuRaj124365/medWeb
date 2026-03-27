import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  reason: {
    type: String,
    enum: ['Incorrect Information', 'Medicine Not Available', 'Wrong Price', 'Expired Medicine Listed', 'Other'],
    required: true
  },
  additionalDetails: { type: String, default: '' },
  reporterName: { type: String, default: '' },
  reporterEmail: { type: String, default: '' },
  dateReported: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
