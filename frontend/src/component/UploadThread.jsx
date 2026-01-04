import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addThread } from "../redux/threadSlice";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function UploadThread() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userData } = useSelector(state => state.user);
    const [fakeWarning, setFakeWarning] = useState("");

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

        if (images.length > 0) {
            images.forEach(img => formData.append("images", img));
        }

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
        setFakeWarning("");
        try {
            const checkRes = await axios.post("http://127.0.0.1:8000/predict", { title: content });
            console.log("Fake check response:", checkRes.data);
            if (checkRes.data.label.toLowerCase() === "1") {
                setFakeWarning("⚠ This content seems fake! You cannot post it.");
                setLoading(false);
                return;
            }
            const newThread = await uploadThreadApi({ content, images, video });
            dispatch(addThread(newThread));

            setContent("");
            setImages([]);
            setVideo(null);
            setPreviewImages([]);
            setPreviewVideo("");
            setFakeWarning("");

            navigate("/threads");

        } catch (error) {
            console.log("UPLOAD ERROR:", error);
            alert("Something went wrong while posting.");
        } finally {
            setLoading(false);
        }
    };

    const highlightHashtags = (text) => {
        return text.split(/(#[^\s#]+)/g).map((part, i) =>
            part.startsWith("#") ? (
                <span key={i} className="text-blue-400 font-medium">{part}</span>
            ) : (
                part
            )
        );
    };

    return (
        <div className="border-b w-full bg-[var(--primary)]/90 border-gray-800 p-4 text-[var(--text)] text-[var(--text1)] ">
            <textarea
                className="w-full bg-transparent outline-none text-[var(--text)] text-lg resize-none placeholder:text-[var(--text)]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
            />
            {/* <div className="mt-2 text-gray-300">
                {highlightHashtags(content)}
            </div> */}
            {fakeWarning && (
                <div className="text-yellow-400 font-medium mt-2">{fakeWarning}</div>
            )}


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
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            hidden
                            onChange={handleImages}
                        />
                    </label>

                    <label className="cursor-pointer text-blue-400">
                        🎥
                        <input
                            type="file"
                            accept="video/*"
                            hidden
                            onChange={handleVideo}
                        />
                    </label>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-4 py-2 cursor-dot1 rounded-full font-semibold
        ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500"}
    `}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                            Posting...
                        </div>
                    ) : (
                        "Post"
                    )}

                </button>
            </div>
        </div>
    );

}

export default UploadThread;
