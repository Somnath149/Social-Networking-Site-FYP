import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Loop from "../models/loop.model.js";
import Thread from "../models/thread.model.js";
import Report from "../models/report.model.js";
import Notification from "../models/notification.model.js";
import { contentRemovedMail, userBlockMail, userUnblockMail } from "../config/mail.js";
import Issue from "../models/issue.model.js";

export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ role: -1 });

    return res.status(200).json({
      success: true,
      total: users.length,
      users
    });
  } catch (error) {
    return res.status(500).json({ message: `Admin Error: ${error.message}` });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [userCount, postCount, loopCount, threadCount] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Loop.countDocuments(),
      Thread.countDocuments()
    ]);

    return res.status(200).json({
      users: userCount,
      posts: postCount,
      loops: loopCount,
      threads: threadCount
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const manageUserStatus = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const reportContent = async (req, res) => {
  try {
    const { contentId, contentType, reason } = req.body;

    if (!contentId || !contentType || !reason) {
      return res.status(400).json({ message: "All fields required" });
    }

    let content;
    if (contentType === "Post") content = await Post.findById(contentId);
    if (contentType === "Loop") content = await Loop.findById(contentId);
    if (contentType === "Thread") content = await Thread.findById(contentId);

    if (!content) return res.status(404).json({ message: "Content not found" });

    const existingReport = await Report.findOne({ contentId, contentType, status: "pending" });

    if (existingReport) {
      existingReport.reportCount = (existingReport.reportCount || 1) + 1;
      await existingReport.save();
      return res.status(200).json({
        success: true,
        message: `This content has been reported again. Total reports: ${existingReport.reportCount}`,
      });
    }

    await Report.create({
      reporter: req.userId,
      contentOwner: content.author,
      contentId,
      contentType,
      reason,
      reportCount: 1
    });

    return res.status(201).json({
      success: true,
      message: "Content reported successfully",
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resolveSingleReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = "resolved";
    await report.save();

    return res.status(200).json({
      success: true,
      message: "Report resolved successfully",
    });
  } catch (error) {
    console.error("Resolve report error:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "pending" })
      .populate("reporter", "name userName")
      .populate("contentOwner", "_id userName")
      .sort({ createdAt: -1 });

return res.status(200).json({
  success: true,
  reports
});
  } catch (error) {
  return res.status(500).json({ message: error.message });
}
};

export const deleteReportedContent = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    let content;
    let contentField = {};

    if (report.contentType === "Post") {
      content = await Post.findById(report.contentId).populate("author");
      if (content) {
        contentField.post = content._id;
        await Post.findByIdAndDelete(report.contentId);
      }
    }
    if (report.contentType === "Loop") {
      content = await Loop.findById(report.contentId).populate("author");
      if (content) {
        contentField.loop = content._id;
        await Loop.findByIdAndDelete(report.contentId);
      }
    }
    if (report.contentType === "Thread") {
      content = await Thread.findById(report.contentId).populate("author");
      if (content) {
        contentField.thread = content._id;
        await Thread.findByIdAndDelete(report.contentId);
      }
    }

    const author = content?.author;

    if (author) {
      await Notification.create({
        sender: req.userId,
        receiver: author._id,
        type: "admin",
        message: `Your ${report.contentType} was removed. Reason: ${report.reason}`,
        ...contentField,
      });

      if (author.email) {
        await contentRemovedMail({
          to: author.email,
          userName: author.userName,
          contentType: report.contentType,
          reason: report.reason,
        });
      }
    }

    report.status = "resolved";
    await report.save();

    return res.status(200).json({
      success: true,
      message: "Content deleted, user notified via app & email",
    });
  } catch (error) {
    console.error("Delete report error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const adminActionOnUser = async (req, res) => {
  try {
    const { userId, action, reason } = req.body;

    if (!userId || !action) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (action === "block") {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          isBlocked: true,
          blockReason: reason || "Violation of community guidelines"
        },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      try {
        await userBlockMail({
          to: user.email,
          userName: user.userName,
          reason: user.blockReason
        });
      } catch (e) {
        console.error("Block mail failed:", e.message);
      }

      return res.status(200).json({
        success: true,
        message: "User blocked successfully",
        user
      });
    }

    if (action === "unblock") {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          isBlocked: false,
          blockReason: null
        },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      try {
        await userUnblockMail({
          to: user.email,
          userName: user.userName
        });
      } catch (e) {
        console.error("Unblock mail failed:", e.message);
      }

      return res.status(200).json({
        success: true,
        message: "User unblocked successfully",
        user
      });
    }

    if (action === "delete") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted permanently" });
    }

    return res.status(400).json({ message: "Invalid action" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getContentPreview = async (req, res) => {
  try {
    const { contentType, contentId } = req.params;

    let content;

    if (contentType === "Post") {
      content = await Post.findById(contentId)
        .populate("author", "userName profileImage");
    }

    if (contentType === "Loop") {
      content = await Loop.findById(contentId)
        .populate("author", "userName profileImage");
    }

    if (contentType === "Thread") {
      content = await Thread.findById(contentId)
        .populate("author", "userName profileImage").populate({
  path: "quoteThread",
  populate: { path: "author", select: "userName profileImage" }
});

    }

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json({
      success: true,
      contentType,
      content
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const search = async (req, res) => {
    try {
        const keyWord = req.query.keyWord
        if (!keyWord) {
            return res.status(400).json({ message: `Keyword is required :${error}` })
        }

        const users = await User.find({
            $or: [
                { userName: { $regex: keyWord, $options: "i" } },
                { name: { $regex: keyWord, $options: "i" } }
            ]
        }).select("-password")
        return res.status(200).json(users)
    }
    catch (error) {
        return res.status(500).json({ message: `Search error :${error}` })
    }
}

export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: "pending" }) 
      .populate("user", "userName email isBlocked role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: issues.length,
      issues
    });
  } catch (error) {
    return res.status(500).json({
      message: `Get issues error: ${error.message}`
    });
  }
};



export const resolveIssue = async (req, res) => {
  try {
    const { adminReply } = req.body;
    const { issueId } = req.params;

    const issue = await Issue.findByIdAndUpdate(
      issueId,
      {
        status: "resolved",
        adminReply
      },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Issue resolved successfully",
      issue
    });

  } catch (error) {
    return res.status(500).json({
      message: `Resolve issue error: ${error.message}`
    });
  }
};
