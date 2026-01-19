import React, { useState } from "react";
import axios from "axios";
import { AlertCircle, Send, MessageSquare, LogOut } from "lucide-react";


const Blocked = () => {
  const [issue, setIssue] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const serverUrl = "http://localhost:8000"
  const handleSendIssue = async () => {
    if (issue.trim().length < 10) {
      return alert("Please explain your issue in at least 10 characters.");
    }

    try {
      setSending(true);

      await axios.post(
        `${serverUrl}/api/auth/report-issue`,
        { issue },
        { withCredentials: true }
      );


      setSuccess(true);
      setIssue("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send issue");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 bg-[#1a1d23] rounded-3xl overflow-hidden shadow-2xl border border-white/5">

        <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-red-500/10 to-transparent">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="text-red-500" size={40} />
          </div>

          <h1 className="text-4xl font-bold mb-4">Account Restricted</h1>

          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            Your account has been blocked due to a policy violation.
            If you believe this is a mistake, you can submit an appeal.
          </p>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Status: Blocked
          </div>

          <button className="mt-10 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <LogOut size={18} /> Sign out
          </button>
        </div>

        <div className="p-8 md:p-12 bg-[#21252b]">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="text-indigo-400" size={20} />
            <h3 className="text-xl font-semibold">Appeal to Support</h3>
          </div>

          {success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-emerald-400 text-sm">
              Your appeal has been submitted successfully.
              Our team will review it shortly.
            </div>
          ) : (
            <>
              <label className="block text-sm text-gray-400 mb-2">
                Why should we review your account?
              </label>

              <textarea
                rows="6"
                placeholder="Explain your situation clearly and politely..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full bg-[#1a1d23] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
              />

              <button
                disabled={sending}
                onClick={handleSendIssue}
                className={`w-full mt-4 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${sending
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                  }`}
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Submit Appeal
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Response time: usually within 24–48 hours.
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Blocked;
