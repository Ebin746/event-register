import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  idea: {
    type: String,
    required: true,
    trim: true
  },
  leaderName: {
    type: String,
    required: true,
    trim: true
  },
  leaderEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    index: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  members: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Prevent model recompilation during hot reload
export default mongoose.models.Team || mongoose.model("Team", TeamSchema);