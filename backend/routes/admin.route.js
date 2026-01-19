import express from "express";
import isAdmin from "../middlewares/isAdmin.js"; 
import { 
  adminActionOnUser,
    deleteReportedContent,
    getAllIssues,
    getAllReports,
    getAllUsersAdmin, 
    getContentPreview, 
    getDashboardStats, 
    manageUserStatus,
    resolveIssue,
    resolveSingleReport,
    search, 
} from "../controllers/admin.controller.js";
import isAuth from "../middlewares/isAuth.js";

const Adminrouter = express.Router();

Adminrouter.get("/stats", isAuth, isAdmin, getDashboardStats);
Adminrouter.get("/users", isAuth, isAdmin, getAllUsersAdmin);
Adminrouter.put("/update-user", isAuth, isAdmin, manageUserStatus);
Adminrouter.get("/reports", isAuth, isAdmin, getAllReports);
Adminrouter.delete("/report/:reportId", isAuth, isAdmin, deleteReportedContent);
Adminrouter.post("/user-action", isAuth, isAdmin, adminActionOnUser);
Adminrouter.get(
  "/preview/:contentType/:contentId",
  isAuth,
  isAdmin,
  getContentPreview
);
Adminrouter.patch("/report/:reportId/resolve", isAuth, isAdmin, resolveSingleReport);
Adminrouter.get("/search",isAuth,isAdmin,search)
Adminrouter.get("/issues", isAuth, isAdmin, getAllIssues);
Adminrouter.patch("/issue/:issueId/resolve", isAuth, isAdmin, resolveIssue);

export default Adminrouter;