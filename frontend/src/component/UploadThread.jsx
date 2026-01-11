import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addThread } from "../redux/threadSlice";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function UploadThread() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideo, setPreviewVideo] = useState("");

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewImages(files.map(f => URL.createObjectURL(f)));
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setPreviewVideo(URL.createObjectURL(file));
  };

  const uploadThreadApi = async ({ content, images, video }) => {
    const formData = new FormData();
    formData.append("content", content);

    images.forEach(img => formData.append("images", img));
    if (video) formData.append("video", video);

    const res = await axios.post(
      `${serverUrl}/api/thread/upload`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    return res.data;
  };

  const handleSubmit = async () => {
    if (!content && images.length === 0 && !video) {
      alert("Write something or upload media!");
      return;
    }

    setLoading(true);

    try {
      const newThread = await uploadThreadApi({ content, images, video });

      // 🔥 Optimistic UI
      dispatch(addThread(newThread));

      setContent("");
      setImages([]);
      setVideo(null);
      setPreviewImages([]);
      setPreviewVideo("");

      navigate("/threads");

    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert("Something went wrong while posting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b w-full bg-[var(--primary)]/90 border-gray-800 p-4 text-[var(--text)]">
      <textarea
        className="w-full bg-transparent outline-none text-lg resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
      />

      {/* IMAGE PREVIEW */}
      {previewImages.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {previewImages.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-28 h-28 rounded-lg object-cover border border-gray-700"
            />
          ))}
        </div>
      )}

      {/* VIDEO PREVIEW */}
      {previewVideo && (
        <video
          src={previewVideo}
          controls
          className="w-64 rounded-lg mt-3 border border-gray-700"
        />
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-3">
          <label className="cursor-pointer text-blue-400">
            📷
            <input type="file" multiple accept="image/*" hidden onChange={handleImages} />
          </label>

          <label className="cursor-pointer text-blue-400">
            🎥
            <input type="file" accept="video/*" hidden onChange={handleVideo} />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded-full font-semibold
            ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500"}`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

export default UploadThread;
