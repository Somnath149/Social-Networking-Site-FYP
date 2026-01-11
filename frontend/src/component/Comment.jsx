import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { FaRegComment, FaHeart, FaRegHeart } from "react-icons/fa6";
import {
  setCommentedThreads,
  updateLikes,
  addComment,
  setPreview
} from "../redux/threadSlice";
import ThreadPreview from "./ThreadPreview";
import renderCaption from "../hooks/useRenderCaption";

function Comment({ userId, mythreadTailwind }) {
  const { commentedThreads } = useSelector(state => state.thread);
  const { userData } = useSelector(state => state.user);
  const [previewThread, setPreviewThread] = useState(null);
  const [commentText, setCommentText] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLike = async (threadId, e) => {
    e.stopPropagation();
    try {
      const res = await axios.get(
        `${serverUrl}/api/thread/like/${threadId}`,
        { withCredentials: true }
      );

      dispatch(updateLikes({
        threadId: res.data._id,
        likes: res.data.likes
      }));
    } catch (error) {
      console.log("LIKE ERROR:", error);
    }
  };

  const handleComment = async (threadId, e) => {
    e.stopPropagation();
    try {
      const message = commentText[threadId];
      if (!message) return;

      const res = await axios.post(
        `${serverUrl}/api/thread/comment/${threadId}`,
        { message },
        { withCredentials: true }
      );

      dispatch(addComment({
        threadId,
        updatedThread: res.data
      }));

      setCommentText(prev => ({ ...prev, [threadId]: "" }));
    } catch (err) {
      console.log("COMMENT ERROR:", err);
    }
  };

  useEffect(() => {
    const fetchCommentedThreads = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/thread/userCommented/${userId}`,
          { withCredentials: true }
        );
        dispatch(setCommentedThreads(res.data));
      } catch (err) {
        console.log("FETCH COMMENTED THREADS ERROR:", err);
      }
    };

    fetchCommentedThreads();
  }, [dispatch, userId]);

  return (
    <div className={`lg:w-[50%] w-full ${!mythreadTailwind ? "h-screen overflow-y-scroll bg-black" : ""}`}>

      <h2 className="text-black text-2xl font-bold mb-5">
        Threads You Commented On
      </h2>

      {commentedThreads.length === 0 && (
        <p className="text-gray-400 text-center mt-10 mb-8">
          No commented threads yet...
        </p>
      )}

      {commentedThreads.map(thread => (
        <div
          key={thread._id}
          onClick={() => {
            setPreviewThread(thread);
            dispatch(setPreview(thread));
          }}
          className="bg-[var(--bg)] text-[var(--text)] rounded-2xl shadow-md p-5 mb-6 hover:shadow-lg cursor-pointer"
        >

          <div className="flex items-center gap-3 mb-3">
            <img
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${thread.author?.userName}`);
              }}
              src={thread.author.profileImage}
              className="w-11 h-11 rounded-full object-cover  border-[var(--border)] border"
            />

            <div>
              <p className="font-semibold ">
                {thread.author.name}
              </p>
              <p className=" text-sm">
                @{thread.author.userName}
              </p>
            </div>
          </div>

          <p className=" mb-3">
            {renderCaption(thread?.caption || thread?.content, navigate)}
          </p>

{thread.quoteThread && (
  <div className="mt-3  pl-4 bg-[var(--primary)] rounded-xl">

    <div className="flex items-center gap-2 mb-1">
      
      <span className="text-xs py-[10px]">
        @{thread.quoteThread.author.userName}
      </span>
    </div>

    <p className="text-sm ">
      {renderCaption(thread?.quoteThread?.caption || thread?.quoteThread?.content,navigate)}
    </p>

    {thread.quoteThread.images?.length > 0 && (
      <div className="mt-2 gap-2">
        {thread.quoteThread.images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-[20] h-[20]  object-cover"
          />
        ))}
      </div>
    )}

    {thread.quoteThread.mediaType === "video" &&
      thread.quoteThread.video && (
        <video
          src={thread.quoteThread.video}
          className="w-full max-h-[400px] rounded-lg mt-2 "
        />
      )}
  </div>
)}

          {thread.images?.map((img, i) => (
            <img key={i} src={img} className="rounded-xl mb-2" />
          ))}

          {thread.mediaType === "video" && (
            <video src={thread.video} controls className="rounded-xl mb-2" />
          )}

          <div className="flex gap-8 mt-4 ">

            <div
              onClick={(e) => handleLike(thread._id, e)}
              className="flex items-center gap-1 hover:text-red-600"
            >
              {thread.likes?.includes(userData._id)
                ? <FaHeart className="text-red-600" />
                : <FaRegHeart />}
              {thread.likes?.length}
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1"
            >
              <FaRegComment />
              {thread.comments?.length}
            </div>
          </div>

          {thread.comments?.slice(0, 2).map(c => (
            <p key={c._id} className="text-sm mt-2">
              <b>@{c.author?.userName}</b> {c.content}
            </p>
          ))}

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex gap-2 mt-3"
          >
            <input
              type="text"
              placeholder="Reply..."
              value={commentText[thread._id] || ""}
              onChange={(e) =>
                setCommentText(prev => ({
                  ...prev,
                  [thread._id]: e.target.value
                }))
              }
              className="flex-1 border-b  border-[var(--border)] outline-none bg-transparent"
            />
            <button
              onClick={(e) => handleComment(thread._id, e)}
              className="px-3 bg-blue-600 text-white rounded"
            >
              Send
            </button>
          </div>
        </div>
      ))}

      {previewThread && (
        <ThreadPreview
          thread={previewThread}
          onClose={() => {
            setPreviewThread(null);
            dispatch(setPreview(null));
          }}
        />
      )}
    </div>
  );
}

export default Comment;
