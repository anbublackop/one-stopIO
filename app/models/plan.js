import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  day: {
    type: Number,
    default: 1,
    required: true
  }
});

const PlanSchema = new Schema({
  technology: {
    type: String,
    enum: ['node', 'ruby'],
    required: true
  },

  schedules: [ScheduleSchema]
});

export default mongoose.model('Plan', PlanSchema);
