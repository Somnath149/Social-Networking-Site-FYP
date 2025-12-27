import React, { useRef, useState } from 'react';
import ForgotPassword from './ForgotPassword'; // aapka existing ForgotPassword component
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dp1 from "../assets/dp1.jpeg"
import ThemeChanger from './ThemeChanger';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import axios from "axios";

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
  const imageInput = useRef()
  const [frontendImage, setfrontendImage] = useState(userData.profileImage || dp1)
  const [backendImage, setbackendImage] = useState(null)

  const [issue, setIssue] = useState("");
const [sending, setSending] = useState(false);

  const handleSavePersonal = () => alert('Personal Info Saved!');
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
    <div className="flex h-screen overflow-hidden bg-gray-50">


      {/* Left Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">Psync</h2>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer ${activeTab === 'personal' ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </li>
          <li
            className={`cursor-pointer ${activeTab === 'theme' ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
            onClick={() => setActiveTab('theme')}
          >
            Theme
          </li>
          <li
            className={`cursor-pointer ${activeTab === 'security' ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </li>
          <li
            className={`cursor-pointer ${activeTab === 'notifications' ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </li>
          <li
            className={`cursor-pointer ${activeTab === 'help' ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
            onClick={() => setActiveTab('help')}
          >
            Help
          </li>
        </ul>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 overflow-y-auto">

        {activeTab === 'personal' && (
          <div className="max-w-2xl mx-auto bg-[#0a1010] border border-gray-800 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Personal Information
            </h2>

            {/* Profile Image */}
            <div className="flex justify-center mb-8">
              <img
                src={userData.profileImage || dp1}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
              />
            </div>

            {/* Info Fields */}
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <div className="w-full bg-[#111818] border border-gray-700 rounded-xl px-5 py-4 text-white font-semibold">
                  {userData.name}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Username</label>
                <div className="w-full bg-[#111818] border border-gray-700 rounded-xl px-5 py-4 text-white font-semibold">
                  @{userData.userName}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bio</label>
                <div className="w-full bg-[#111818] border border-gray-700 rounded-xl px-5 py-4 text-white leading-relaxed">
                  {userData.bio || "No bio added yet"}
                </div>
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Profession</label>
                <div className="w-full bg-[#111818] border border-gray-700 rounded-xl px-5 py-4 text-white font-medium">
                  {userData.profession || "Not specified"}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-10">
<button className='px-[10px] min-w-[150px] py-[5px] h-940px] bg-[white] cursor-pointer rounded-2xl' onClick={() => navigate("/editprofile")}>Edit Profile</button>
          
            </div>
          </div>

        )}

{activeTab === 'theme' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <h3 className="text-xl font-semibold mb-2">Change Theme</h3>
    <p className="text-gray-600 text-sm mb-4">
      Update your password regularly to keep your account secure.
    </p>
    <ThemeChanger />
  </div>
)}
        {activeTab === 'security' && (
          <div className="max-w-2xl space-y-8">

  {/* Change Password */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <h3 className="text-xl font-semibold mb-2">Change Password</h3>
    <p className="text-gray-600 text-sm mb-4">
      Update your password regularly to keep your account secure.
    </p>
    <ForgotPassword />
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

        {activeTab === 'notifications' && (
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-6">Notifications</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
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
          <div className="max-w-2xl space-y-8">

  {/* Help Header */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <h2 className="text-3xl font-bold mb-2">Help & Support</h2>
    <p className="text-gray-600">
      Need assistance? We’re here to help you with anything you need.
    </p>
  </div>

  {/* Support Contact */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
  <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
  <p className="text-gray-600 mb-4">
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


  {/* Help Center */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <h3 className="text-xl font-semibold mb-2">Help Center</h3>
    <p className="text-gray-600 mb-4">
      Browse guides, FAQs, and tutorials to get the most out of Psync.
    </p>

    <a
      href="#"
      className="inline-flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
    >
      Visit Help Center
    </a>
  </div>

  {/* Quick Tips */}
  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
    <h3 className="text-xl font-semibold mb-4">Quick Tips</h3>

    <ul className="space-y-3 text-gray-700 list-disc list-inside">
      <li>Keep your profile updated for better visibility.</li>
      <li>Enable two-factor authentication for extra security.</li>
      <li>Regularly review your login activity.</li>
    </ul>
  </div>

</div>

        )}
      </div>

{showDeleteModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4">

      <h2 className="text-xl font-bold text-red-600">
        Delete Account
      </h2>

      <p className="text-gray-600 text-sm">
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
