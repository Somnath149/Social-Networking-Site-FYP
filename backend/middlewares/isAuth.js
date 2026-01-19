import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("isBlocked role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isBlocked && req.path !== "/report-issue") {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    req.userId = user._id;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
      error: error.message
    });
  }
};

export default isAuth;
