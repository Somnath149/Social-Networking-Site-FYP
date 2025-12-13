import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { FaRegComment, FaHeart, FaRegHeart } from "react-icons/fa6";
import { addRetweet, setCommentedThreads, updateLikes } from "../redux/threadSlice";

function Comment({ userId, mythreadTailwind }) {
  const { threads } = useSelector(state => state.thread);
  const { commentedThreads } = useSelector(state => state.thread);
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleLike = async (threadId) => {
    try {
      const res = await axios.get(`${serverUrl}/api/thread/like/${threadId}`, { withCredentials: true });

      dispatch(updateLikes({
        threadId: res.data._id,
        likes: res.data.likes
      }));

    } catch (error) {
      console.log("LIKE ERROR:", error);
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
        console.log("Error fetching commented threads:", err);
      }
    };

    fetchCommentedThreads();
  }, [dispatch]);

  return (
    <div className={`lg:w-[50%] w-full  ${!mythreadTailwind ? "h-screen overflow-y-scroll bg-black" : ""}`}>

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
          className="bg-gray-100 px-[-15px] rounded-2xl shadow-md p-5 mb-6 transition hover:shadow-lg"
        >
          {/* USER SECTION */}
          <div className="flex items-center gap-3 ml-[-15px] mb-3">
            <img
              onClick={() => navigate(`/profile/${thread.author?.userName}`)}
              src={thread.author.profileImage}
              alt="profile"
              className="w-11 h-11 rounded-full object-cover border"
            />

            <div>
              <p className="font-semibold text-gray-900">{thread.author.name}</p>
              <p className="text-gray-500 text-sm">@{thread.author.userName}</p>
            </div>
          </div>

          {/* CONTENT */}
          <p className="text-gray-900 text-[15px] leading-relaxed mb-3">
            {thread.caption || thread.content}
          </p>

          {/* IMAGES */}
          {thread.images?.length > 0 && (
            <div className="rounded-xl mt-3">
              {thread.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="rounded-xl w-full object-cover border"
                />
              ))}
            </div>
          )}

          {/* VIDEO */}
          {thread.mediaType === "video" && thread.video && (
            <video
              src={thread.video}
              controls
              className="w-full rounded-xl border mt-2"
            />
          )}
          {/* Quoted Thread */}
          {thread.quoteThread && (
            <div className="border-l-4 border-gray-300 pl-4 mt-3 rounded-xl bg-gray-50">
              <h1 className="font-semibold">
                {thread.quoteThread.author.name}{" "}
                <span className="text-sm text-gray-500">
                  @{thread.quoteThread.author.userName}
                </span>
              </h1>
              <p className="text-gray-900 text-sm mt-1">
                {thread.quoteThread.caption || thread.quoteThread.content}
              </p>

              {thread.quoteThread.images?.length > 0 &&
                thread.quoteThread.images.map((img, i) => (
                  <img key={i} src={img} className="rounded-xl mt-2" alt="quoted-media" />
                ))
              }

              {thread.quoteThread.mediaType === "video" && thread.quoteThread.video && (
                <video src={thread.quoteThread.video} controls className="w-full rounded-xl mt-2 border" />
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-start gap-8 text-gray-600 mt-4 text-lg">

            {/* LIKE */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition"
              onClick={() => handleLike(thread._id)}
            >
              {!thread.likes?.includes(userData._id)
                ? <FaRegHeart className="w-[22px] h-[22px]" />
                : <FaHeart className="w-[22px] h-[22px] text-red-600" />
              }
              <span className="text-[15px]">{thread.likes?.length}</span>
            </div>

            {/* COMMENT */}
            <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition">
              <FaRegComment className="w-[21px] h-[21px]" />
              <span className="text-[15px]">{thread.comments?.length}</span>
            </div>

          </div>

          {/* COMMENT PREVIEW */}
          <div className="mt-3">
            {thread.comments?.slice(0, 2).map(c => (
              <div
                key={c._id}
                className="pl-4 border-l-2 flex border-gray-300 mt-2 text-[14px]"
              >
                <div className="gap-[7px] flex">
                  <img src={c.author.profileImage} className="w-[25px] h-[25px] ml-[-15px] rounded-full object-cover" alt="" />
                  <span className="font-medium text-gray-800">
                    {c.author.userName}
                  </span>
                </div>
                : {c.content}
              </div>
            ))}

            {thread.comments?.length > 2 && (
              <p className="text-blue-600 text-xs mt-2 cursor-pointer hover:underline">
                View all comments...
              </p>
            )}
          </div>

        </div>
      ))}
    </div>

  );
}

export default Comment;
