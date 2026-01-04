import React, { useRef, useState } from 'react';
import ForgotPassword from './ForgotPassword'; // aapka existing ForgotPassword component
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dp1 from "../assets/dp1.jpeg"
import ThemeChanger from './ThemeChanger';
import { serverUrl } from '../App';
import { setNotificationsEnabled, setUserData } from '../redux/userSlice';
import axios from "axios";
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

function Settings() {
  const [activeTab, setActiveTab] = useState('personal');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false)
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [notifications, setNotifications] = useState(true);

  const [issue, setIssue] = useState("");
  const [sending, setSending] = useState(false);
  const { notificationsEnabled } = useSelector(state => state.user);
  const handleSaveNotifications = () => alert('Notification Settings Saved!');


  const handleLogOut = async () => {
    const ok = confirm("Do you want to logout?");
    if (!ok) return;
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deleteEmail || !deletePassword) {
      return alert("Email and password are required");
    }

    const confirmDelete = confirm(
      "This will permanently delete your account. Are you sure?"
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);

      await axios.delete(
        `${serverUrl}/api/user/delete-account`,
        {
          data: {
            email: deleteEmail,
            password: deletePassword
          },
          withCredentials: true
        }
      );

      dispatch(setUserData(null));
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row  h-screen overflow-hidden bg-[var(--bg)]/90">
      {/* Left Navigation */}
      <div className="w-full lg:w-64 bg-[var(--bg)] border-b lg:border-b-0 lg:border-r border-gray-200 p-4 lg:p-6">
        <div className='flex items-center gap-3'>
          <div className='text-[var(--text)] w-[25px] h-[25px] cursor-pointer'
            onClick={() => navigate("/")}>
            <MdOutlineKeyboardBackspace className='text-[var(--text)] cursor-pointer w-[25px] h-[25px]' />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)]   text-center lg:text-left">
            Psync
          </h2>
        </div>

        <ul className="flex lg:flex-col justify-between mt-10 lg:justify-start gap-5 lg:gap-5 text-sm lg:text-base">
          <li
            className={`cursor-pointer text-center lg:text-left ${activeTab === "personal"
              ? "text-indigo-600 font-semibold"
              : "text-[var(--text)]"
              }`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Info
          </li>
          <li
            className={`cursor-pointer text-center lg:text-left ${activeTab === "theme"
              ? "text-indigo-600 font-semibold"
              : "text-[var(--text)]"
              }`}
            onClick={() => setActiveTab("theme")}
          >
            Theme
          </li>
          <li
            className={`cursor-pointer text-center lg:text-left ${activeTab === "security"
              ? "text-indigo-600 font-semibold"
              : "text-[var(--text)]"
              }`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </li>
          <li
            className={`cursor-pointer text-center lg:text-left ${activeTab === "notifications"
              ? "text-indigo-600 font-semibold"
              : "text-[var(--text)]"
              }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </li>
          <li
            className={`cursor-pointer text-center lg:text-left ${activeTab === "help"
              ? "text-indigo-600 font-semibold"
              : "text-[var(--text)]"
              }`}
            onClick={() => setActiveTab("help")}
          >
            Help
          </li>
        </ul>
      </div>


      <div className='lg:p-8  overflow-y-auto'>
        {activeTab === 'theme' && (
          <div className="bg-[var(--primary)] border border-gray-200 rounded-2xl shadow-sm">
            {/* <h3 className="text-xl font-semibold mb-2">Change Theme</h3>
            <p className="text-[var(--text)] text-sm mb-4">
              Update your password regularly to keep your account secure.
            </p> */}
            <ThemeChanger />
          </div>
        )}
      </div>

      <div className='lg:p-8  overflow-y-auto'>
        {activeTab === 'security' && (
          <div className="">

            {/* Change Password */}
            <div className="bg-[var(--primary)] border border-gray-200 rounded-2xl p-3 shadow-sm">
              <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Change Password</h3>
              <p className="text-[var(--text)] text-sm mb-4">
                Update your password regularly to keep your account secure.
              </p>
              <ForgotPassword login={true} />
            </div>

            {/* Account Actions */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Danger Zone</h3>
              <p className="text-red-500 text-sm mb-4">
                These actions are irreversible. Proceed with caution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 border border-red-500 text-red-600 rounded-xl hover:bg-red-100 transition"
                  onClick={handleLogOut}>
                  Logout
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                >
                  Delete Account
                </button>

              </div>
            </div>

          </div>

        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {activeTab === "personal" && (
          <div className="max-w-2xl mx-auto bg-[#0a1010] border border-gray-800 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8 text-center">
              Personal Information
            </h2>

            <div className="flex justify-center mb-6 lg:mb-8">
              <img
                src={userData.profileImage || dp1}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-gray-700"
              />
            </div>

            <div className="space-y-4 lg:space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Full Name
                </label>
                <div className="w-full bg-[#111818] border border-gray-700 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white font-semibold">
                  {userData.name}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Username
                </label>
                <div className="w-full bg-[#111818] border border-gray-700 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white font-semibold">
                  @{userData.userName}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Bio
                </label>
                <div className="w-full bg-[#111818] border border-gray-700 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white leading-relaxed">
                  {userData.bio || "No bio added yet"}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Profession
                </label>
                <div className="w-full bg-[#111818] border border-gray-700 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white font-medium">
                  {userData.profession || "Not specified"}
                </div>
              </div>
            </div>

            <div className="mt-8 lg:mt-10 flex justify-center">
              <button
                className="px-4 sm:px-6 py-2 bg-[var(--secondary)] rounded-2xl cursor-pointer min-w-[140px]"
                onClick={() => navigate("/editprofile")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="max-w-xl text-[var(--text)]">
            <h2 className="text-3xl font-bold mb-6">Notifications</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => dispatch(setNotificationsEnabled(!notificationsEnabled))}
                className="w-5 h-5"
              />
              Enable Notifications
            </label>
            <button
              onClick={handleSaveNotifications}
              className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="max-w-2xl text-[var(--text)] space-y-8">

            {/* Help Header */}
            <div className="bg-[var(--primary)] border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-3xl font-bold mb-2">Help & Support</h2>
              <p className="text-[var(--text)]">
                Need assistance? We’re here to help you with anything you need.
              </p>
            </div>

            {/* Support Contact */}
            <div className="bg-[var(--primary)] border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
              <p className="text-[var(--text)] mb-4">
                Describe your issue and our team will get back to you.
              </p>

              <textarea
                rows="5"
                placeholder="Write your problem here..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 mb-4 resize-none"
              />

              <button
                disabled={sending}
                onClick={async () => {
                  if (!issue.trim()) return alert("Please write your issue");

                  try {
                    setSending(true);
                    await axios.post(
                      `${serverUrl}/api/auth/report-issue`,
                      { issue },
                      { withCredentials: true }
                    );
                    alert("Issue sent successfully");
                    setIssue("");
                  } catch (err) {
                    alert(err.response?.data?.message || "Failed to send issue");
                  } finally {
                    setSending(false);
                  }
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
              >
                {sending ? "Sending..." : "Send to Support"}
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-[var(--primary)] border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Tips</h3>

              <ul className="space-y-3 text-[var(--text)] list-disc list-inside">
                <li>Keep your profile updated for better visibility.</li>
                <li>Use a strong, unique password for your social media accounts.</li>
                <li>Think before you post — once it’s online, it can be shared widely.</li>
                <li>Be careful before clicking links in DMs or comments — watch out for phishing.</li>
              </ul>
            </div>

          </div>

        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[var(--primary)] w-full max-w-md rounded-2xl p-6 space-y-4">

            <h2 className="text-xl font-bold text-red-600">
              Delete Account
            </h2>

            <p className="text-[var(--text)] text-sm">
              This action is irreversible. Please confirm your credentials.
            </p>

            <input
              type="email"
              placeholder="Email"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />

            <input
              type="password"
              placeholder="Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={deleteLoading}
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>

  );

}

export default Settings;
