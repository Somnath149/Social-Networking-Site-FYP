import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    issue: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["block", "account", "bug", "report", "other"],
      default: "other"
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending"
    },

    adminReply: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
