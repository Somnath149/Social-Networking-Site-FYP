import React from "react";
import { useDispatch } from "react-redux";
import { clearContentPreview } from "../redux/adminSlice";
import { Loader2, Eye, X } from "lucide-react";

const AdminPreview = ({ previewOpen, setPreviewOpen, previewLoading, contentPreview }) => {
  const dispatch = useDispatch();

  if (!previewOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">

        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-black flex items-center gap-2">
            <Eye size={18} className="text-blue-600" />
            Preview
          </h3>
          <button
            onClick={() => {
              setPreviewOpen(false);
              dispatch(clearContentPreview());
            }}
            className="p-2 rounded-xl hover:bg-red-50 hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>

 
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-3 bg-gray-50">

          {previewLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : contentPreview && (
            <>
        
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border">
                <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center font-black uppercase">
                  {contentPreview.author?.userName?.charAt(0)}
                </div>
                <p className="text-sm font-black">@{contentPreview.author?.userName}</p>
              </div>

              {(contentPreview?.caption || contentPreview?.content) && (
                <div className="bg-white p-4 rounded-2xl border">
                  <p className="text-sm italic">
                    {contentPreview?.caption || contentPreview?.content}
                  </p>
                </div>
              )}

              {contentPreview?.media && (
                contentPreview?.media.endsWith(".mp4") ? (
                  <video  autoPlay className="w-full rounded-2xl border my-2 max-h-120">
                    <source src={contentPreview?.media} />
                  </video>
                ) : (
                  <img
                    src={contentPreview?.media}
                    alt="media"
                    className="w-full rounded-2xl border my-2 object-cover max-h-120"
                  />
                )
              )}

              {contentPreview?.video && (
                <video  autoPlay className="w-full rounded-2xl border my-2 max-h-120">
                  <source src={contentPreview?.video} />
                </video>
              )}

              {Array.isArray(contentPreview?.images) && contentPreview?.images?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {contentPreview?.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="h-32 md:h-36 rounded-xl object-cover border"
                    />
                  ))}
                </div>
              )}

              {contentPreview?.quoteThread && (
                <div className="bg-white border-l-4 border-blue-500 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-bold text-blue-600">
                    Quoted from @{contentPreview?.quoteThread.author?.userName}
                  </p>

                  <p className="text-sm italic">
                    {contentPreview?.quoteThread?.content}
                  </p>

                  {Array.isArray(contentPreview?.quoteThread?.images) && contentPreview?.quoteThread?.images?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {contentPreview?.quoteThread?.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="h-28 md:h-32 rounded-xl object-cover border"
                        />
                      ))}
                    </div>
                  )}

                  {contentPreview?.quoteThread?.video && (
                    <video  autoPlay className="w-full rounded-xl border my-2 max-h-120">
                      <source src={contentPreview?.quoteThread?.video} />
                    </video>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPreview;
