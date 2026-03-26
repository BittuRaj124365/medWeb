import mongoose from 'mongoose';

const adminActivityLogSchema = new mongoose.Schema({
  actionType: { 
    type: String, 
    enum: ['ADD', 'EDIT', 'DELETE', 'APPROVE_FEEDBACK', 'REJECT_FEEDBACK', 'DELETE_FEEDBACK'], 
    required: true 
  },
  medicineName: { type: String, default: '' },
  adminUsername: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AdminActivityLog', adminActivityLogSchema);
