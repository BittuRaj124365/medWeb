import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, default: '' },
  dateSubmitted: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);
