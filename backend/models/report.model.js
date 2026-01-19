import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

   contentOwner: {          // ✅ ADD THIS
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },


  contentType: {
    type: String,
    enum: ["Post", "Loop", "Thread"],
    required: true
  },

  reason: {
    type: String,
    required: true
  },
  reportCount: {          // ✅ NEW FIELD
    type: Number,
    default: 1
  },

  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
