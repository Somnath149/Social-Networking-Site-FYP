import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import dp from "../assets/dp.png";
import {
  setAllUsers,
  setReports,
  setContentPreview,
  clearContentPreview,
  unblockUserRedux,
  blockUserRedux,
  setIssues,
  resolveIssueRedux,
} from "../redux/adminSlice";
import {
  Trash2,
  ShieldCheck,
  Loader2,
  Users,
  FileText,
  Play,
  MessageSquare,
  ShieldAlert,
  RefreshCw,
  X,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import { setSearchData } from "../redux/userSlice";
import AdminPreview from "../component/AdminPreview";

const serverUrl = "http://localhost:8000";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { allUsers, reports, contentPreview, issues } = useSelector(
    (state) => state.admin
  );
  const { searchData } = useSelector(state => state.user)

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    loops: 0,
    threads: 0,
  });

const [previewOpen, setPreviewOpen] = useState(false);
const [previewLoading, setPreviewLoading] = useState(false);
  const [previewType, setPreviewType] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [reportType, setReportType] = useState("Post");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, reportsRes, issuesRes] = await Promise.all([
        axios.get(`${serverUrl}/api/admin/users`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/stats`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/reports`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/issues`, { withCredentials: true }),
      ]);

      if (usersRes.data.success) dispatch(setAllUsers(usersRes.data.users));
      if (statsRes.data) setStats(statsRes.data);
      if (issuesRes.data.success) {
        dispatch(setIssues(issuesRes.data.issues));
      }
      if (reportsRes.data.success)
        dispatch(setReports(reportsRes.data.reports));
    } catch {
      toast.error("Admin data fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user permanently?")) return;
    try {
      await axios.post(
        `${serverUrl}/api/admin/user-action`,
        { userId: id, action: "delete" },
        { withCredentials: true }
      );
      dispatch(setAllUsers(allUsers.filter((u) => u._id !== id)));
      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const blockUser = async (id) => {
    try {
      await axios.post(
        `${serverUrl}/api/admin/user-action`,
        { userId: id, action: "block" },
        { withCredentials: true }
      );
      dispatch(blockUserRedux(id));
      toast.success("User blocked");
    } catch {
      toast.error("Block failed");
    }
  };

  const unblockUser = async (id) => {
    try {
      await axios.post(
        `${serverUrl}/api/admin/user-action`,
        { userId: id, action: "unblock" },
        { withCredentials: true }
      );
      dispatch(unblockUserRedux(id));
      toast.success("User unblocked");
    } catch {
      toast.error("Unblock failed");
    }
  };

  const handleRoleUpdate = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await axios.put(
        `${serverUrl}/api/admin/update-user`,
        { userId, role: newRole },
        { withCredentials: true }
      );
      if (res.data.user) {
        const updatedList = allUsers.map((u) =>
          u._id === userId ? { ...u, role: newRole } : u
        );
        dispatch(setAllUsers(updatedList));
        toast.success(`Role updated to ${newRole}`);
      }
    } catch {
      toast.error("Role update failed");
    }
  };

  const deleteReportedContent = async (id) => {
    try {
      const res = await axios.delete(`${serverUrl}/api/admin/report/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setReports(reports.filter((r) => r._id !== id)));
        toast.success("Content removed");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Remove failed");
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      dispatch(setSearchData([]));
      return;
    }
    try {
      const res = await axios.get(
        `${serverUrl}/api/user/search?keyWord=${query}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(res.data));
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => handleSearch(input), 300);
    return () => clearTimeout(timeout);
  }, [input]);

  const openPreview = async (report) => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewType(report.contentType);
    dispatch(clearContentPreview());

    try {
      const res = await axios.get(
        `${serverUrl}/api/admin/preview/${report.contentType}/${report.contentId}`,
        { withCredentials: true }
      );
      dispatch(setContentPreview(res.data.content));
    } catch {
      toast.error("Preview load failed");
      setPreviewOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };


  const resolveIssue = async (id) => {
    if (!window.confirm("Resolve this issue?")) return;

    try {
      await axios.patch(
        `${serverUrl}/api/admin/issue/${id}/resolve`,
        {},
        { withCredentials: true }
      );

      dispatch(resolveIssueRedux(id));
      toast.success("Issue resolved");
    } catch {
      toast.error("Failed to resolve issue");
    }
  };


  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">

      <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 sticky top-0 h-screen transition-all duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <ShieldAlert className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-black tracking-tight text-gray-800">ADMIN CORE</h1>
        </div>

        <div className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("users")}
            className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full font-semibold ${activeTab === "users" ? "bg-black text-white shadow-lg shadow-gray-200" : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
          >
            <Users size={20} className={activeTab === "users" ? "text-white" : "group-hover:text-black"} />
            Users
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full font-semibold ${activeTab === "reports" ? "bg-black text-white shadow-lg shadow-gray-200" : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
          >
            <ShieldAlert size={20} className={activeTab === "reports" ? "text-white" : "group-hover:text-black"} />
            Reports
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full font-semibold ${activeTab === "stats" ? "bg-black text-white shadow-lg shadow-gray-200" : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
          >
            <FileText size={20} className={activeTab === "stats" ? "text-white" : "group-hover:text-black"} />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab("issues")}
            className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full font-semibold ${activeTab === "issues" ? "bg-black text-white shadow-lg shadow-gray-200" : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
          >
            <FileText size={20} className={activeTab === "issues" ? "text-white" : "group-hover:text-black"} />
            Issue's
          </button>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={fetchData}
            className="flex items-center gap-3 p-3 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition-all w-full"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            Sync Data
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 ">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{activeTab}</h2>
            <h3 className="text-3xl font-black text-gray-900 capitalize">{activeTab} Center</h3>
          </div>
        </header>

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4">
            <StatBox icon={<Users />} label="Total Users" value={stats.users} color="bg-blue-600" />
            <StatBox icon={<FileText />} label="Published Posts" value={stats.posts} color="bg-orange-500" />
            <StatBox icon={<Play />} label="Short Loops" value={stats.loops} color="bg-rose-500" />
            <StatBox icon={<MessageSquare />} label="Active Threads" value={stats.threads} color="bg-emerald-500" />
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">            <div className="p-8 border-b border-gray-50 flex flex-col items-center">
            <form
              className="group w-full max-w-2xl h-14 rounded-2xl bg-gray-50 border border-transparent focus-within:border-black/10 focus-within:bg-white focus-within:shadow-xl transition-all flex items-center px-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <FiSearch className="text-gray-400 group-focus-within:text-black transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search users by name, email or ID..."
                className="flex-1 h-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium px-4"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </form>
          </div>

            <div className="flex-1 overflow-y-auto ">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-8 py-5">User Identity</th>
                    <th>Privileges</th>
                    <th>Current Status</th>
                    <th className="text-right px-8">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[15px]">
                  {(input ? searchData : allUsers)
                    .slice()
                    .sort((a, b) => {
                      if (a.role === "admin" && b.role !== "admin") return -1;
                      if (a.role !== "admin" && b.role === "admin") return 1;
                      return 0;
                    })
                    .map((u) => (
                      <tr key={u._id} className={`group hover:bg-gray-50 transition-colors ${u.isBlocked ? "bg-red-50/30" : ""}`}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className='w-[40px] h-[40px] border-2 border-black rounded-full overflow-hidden'
                            >

                              <img src={u?.profileImage || dp} alt="" className='w-full object-cover' />
                            </div>
                            <span className="font-bold text-gray-800 tracking-tight">{u.userName}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${u.isBlocked ? "bg-red-500" : "bg-emerald-500 pulse"}`}></span>
                            <span className="font-semibold text-gray-600">{u.isBlocked ? "Blocked" : "Active"}</span>
                          </div>
                        </td>
                        <td className="text-right px-8 py-5 space-x-3">
                          {u.role !== "admin" && (
                            <button
                              onClick={() => u.isBlocked ? unblockUser(u._id) : blockUser(u._id)}
                              className={`text-[11px] font-black px-4 py-2 rounded-xl transition-all active:scale-95 ${u.isBlocked ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100" : "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                                }`}
                            >
                              {u.isBlocked ? "UNBLOCK" : "BLOCK USER"}
                            </button>
                          )}
                          <button
                            onClick={() => handleRoleUpdate(u._id, u.role)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            <ShieldCheck size={18} />
                          </button>
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white h-[calc(100vh-140px)] rounded-[2rem] border border-gray-100 shadow-sm
flex flex-col  animate-in slide-in-from-right-8 duration-500">

            <div className="flex justify-between items-center mb-8">
              <h2 className="font-black text-2xl text-gray-900 flex gap-3 items-center">
                <ShieldAlert className="text-red-500" /> Pending Reports
              </h2>
              <div className="flex  p-1 bg-gray-100 rounded-2xl gap-1">
                {["Post", "Thread", "Loop"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setReportType(type)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${reportType === type ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {type.toUpperCase()}S
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports
                  .filter((r) => r.contentType === reportType)
                  .sort((a, b) => b.reportCount - a.reportCount)
                  .map((r) => (
                    <div
                      key={r._id}
                      onClick={() => openPreview(r)}
                      className="group p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-black/5 hover:bg-white hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldAlert size={60} />
                      </div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-red-100 text-red-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">{r.contentType}</span>
                        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{r.reportCount} Reports</span>
                      </div>
                      <p className="text-gray-800 font-bold text-lg leading-tight mb-2">{r.reason}</p>

                      <div className="flex gap-2 mt-6">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (
                              !window.confirm(
                                "Are you sure you want to resolve this report?"
                              )
                            )
                              return;

                            try {
                              await axios.patch(
                                `${serverUrl}/api/admin/report/${r._id}/resolve`,
                                {},
                                { withCredentials: true }
                              );

                              dispatch(
                                setReports(reports.filter((item) => item._id !== r._id))
                              );
                              toast.success("Report resolved");
                            } catch (error) {
                              console.error(error);
                              toast.error("Failed to resolve report");
                            }
                          }}
                          className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 rounded-2xl text-[11px] font-black hover:bg-black hover:text-white transition-all"

                        >
                          Resolve
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteReportedContent(r._id); }}
                          className="flex-1 bg-red-600 text-white py-3 rounded-2xl text-[11px] font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === "issues" && (
          <div className="bg-white h-[calc(100vh-140px)] rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden">

            <div className="p-10 pb-6 flex justify-between items-end">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <h2 className="text-3xl font-[1000] text-gray-900 tracking-tight">
                    User Issues
                  </h2>
                </div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                  Pending Support Tickets — {issues?.length || 0}
                </p>
              </div>

              <div className="hidden md:block px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400">
                SORTED BY NEWEST FIRST
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 pt-4 custom-scrollbar">
              {issues?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <p className="text-gray-500 font-black text-xl italic">All clean! No open issues.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                  {issues?.map((issue) => (
                    <div
                      key={issue._id}
                      className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-black/5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col justify-between overflow-hidden"
                    >

                      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:bg-red-50 transition-colors duration-500" />

                      <div className="relative">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200 uppercase">
                              {issue.user?.userName?.charAt(0) || "U"}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-gray-900 lowercase leading-tight">
                                @{issue.user?.userName}
                              </h4>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                {new Date(issue.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-full">
                            URGENT
                          </span>
                        </div>

                        <div className="mb-8">
                          <p className="text-gray-600 font-semibold leading-relaxed text-sm italic border-l-4 border-red-500 pl-4 py-1 bg-red-50/30 rounded-r-xl">
                            "{issue.issue}"
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => resolveIssue(issue._id)}
                        className="relative overflow-hidden w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-indigo-600 transition-all duration-300 active:scale-[0.97]"
                      >
                        MARK AS RESOLVED
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

<AdminPreview
  previewOpen={previewOpen}
  setPreviewOpen={setPreviewOpen}
  previewLoading={previewLoading}
  contentPreview={contentPreview}
/>

    </div>
  );
};

const StatBox = ({ icon, label, value, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className={`h-14 w-14 ${color} text-white rounded-[1.25rem] flex items-center justify-center mb-6 shadow-lg shadow-gray-200 transition-transform group-hover:scale-110`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="space-y-1">
      <p className="text-3xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()}</p>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

export default AdminUsers;
