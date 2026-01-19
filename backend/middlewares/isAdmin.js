import User from "../models/user.model.js";


const isAdmin = async (req, res, next) => {
    try {
        const admin = await User.findById(req.userId);

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Admin auth failed" });
    }
};

export default isAdmin;
