"use client";

import { useState, useEffect } from "react";
import { 
  Loader2, Search, X, Upload, Image as ImageIcon, Trash2, ArrowRightLeft, AlertTriangle
} from "lucide-react";
import { getMediaLibrary, uploadMedia, deleteMedia, swapMedia } from "@/app/app/settings/website/actions";

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}

export function MediaPicker({ 
  isOpen, 
  onClose, 
  onSelect 
}: MediaPickerProps) {
  const [media, setMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [lastAttemptedDelete, setLastAttemptedDelete] = useState<string | null>(null);
  const [swapSource, setSwapSource] = useState<string | null>(null);
  const [handlingSwap, setHandlingSwap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    const result = await getMediaLibrary();
    if (result.files) {
      setMedia(result.files);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSearch(""); // Clear search to show new image

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadMedia(formData);

    if (result.error) {
      setError(result.error);
    } else {
      await fetchMedia();
    }
    setUploading(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    setConfirmDelete(filename);
  };

  const executeDelete = async (filename: string) => {
    // We NO LONGER setConfirmDelete(null) immediately.
    // Instead, we show a loading state in the modal.
    setDeleting(filename);
    setLastAttemptedDelete(filename);
    setError(null);

    const result = await deleteMedia(filename);

    if (result.error) {
      setError(result.error);
      // Keep confirmDelete set so the modal stays open to show the error
    } else {
      await fetchMedia();
      setLastAttemptedDelete(null);
      setConfirmDelete(null); // Success! Close modal.
    }
    setDeleting(null);
  };

  const handleSwapReplacement = async (newFilename: string) => {
    if (!swapSource) return;
    
    setHandlingSwap(true);
    setError(null);

    const swapResult = await swapMedia(swapSource, newFilename);
    if (swapResult.error) {
      setError(swapResult.error);
      setHandlingSwap(false);
      return;
    }

    // After successful swap, we can delete the old one
    const deleteResult = await deleteMedia(swapSource);
    if (deleteResult.error) {
      // This is unlikely if the swap succeeded, but good to handle
      setError(`Swap succeeded, but deletion failed: ${deleteResult.error}`);
    } else {
      await fetchMedia();
      setSwapSource(null);
    }
    
    setHandlingSwap(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const filteredMedia = media.filter(m => m.toLowerCase().includes(search.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-[#1a1714]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#e5e0d8] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#e5e0d8] flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-[#1a1714]">
              {swapSource ? "Select Replacement Image" : "Media Library"}
            </h3>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">
              {swapSource 
                ? `CHOOSE AN IMAGE TO REPLACE "${swapSource}"` 
                : "Select an asset from /cms-media/original"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {swapSource && (
              <button 
                onClick={() => setSwapSource(null)}
                className="px-3 py-1.5 text-xs font-bold text-[#be7b3b] hover:bg-[#be7b3b]/10 rounded-lg transition-all"
              >
                Cancel Swap
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search + Upload */}
        <div className="p-4 border-b border-[#e5e0d8] bg-[#fcfaf8] flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search images..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e5e0d8] bg-white text-sm focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] outline-none transition-all"
            />
          </div>
          
          <div className="relative">
            <input
              type="file"
              id="media-upload-dashboard"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
            <label
              htmlFor="media-upload-dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm border ${
                uploading 
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                  : "bg-[#be7b3b] text-white border-[#be7b3b] hover:bg-[#a66a32] hover:shadow-md"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload New Asset
                </>
              )}
            </label>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-red-50 border border-red-100 flex flex-col gap-3 transition-all animate-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-red-100 text-red-600 mt-0.5">
                <X className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800">Action Blocked</p>
                <p className="text-xs text-red-600 font-medium leading-relaxed">{error}</p>
              </div>
            </div>
            
            {error.includes("currently in use") && lastAttemptedDelete && (
              <div className="flex justify-end border-t border-red-100 pt-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSwapSource(lastAttemptedDelete);
                    setError(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#be7b3b] text-white text-xs font-bold hover:bg-[#a66a32] transition-all shadow-sm"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Swap & Delete Instead
                </button>
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#be7b3b]" />
              <p className="text-sm text-gray-400 font-medium">Scanning media folder...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm text-gray-400">No images found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((file) => (
                <div
                  key={file}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (swapSource) {
                        if (file === swapSource) {
                          setError("Cannot replace an image with itself. Please pick a different replacement.");
                          return;
                        }
                        handleSwapReplacement(file);
                      } else {
                        onSelect(`/cms-media/original/${file}`);
                      }
                    }
                  }}
                  onClick={() => {
                    if (swapSource) {
                      if (file === swapSource) {
                        setError("Cannot replace an image with itself. Please pick a different replacement.");
                        return;
                      }
                      handleSwapReplacement(file);
                    } else {
                      onSelect(`/cms-media/original/${file}`);
                    }
                  }}
                  className={`group relative aspect-square rounded-2xl border overflow-hidden transition-all text-left bg-[#fcfaf8] ${
                    swapSource 
                      ? (file === swapSource ? "border-red-300 opacity-50 cursor-not-allowed" : "border-[#be7b3b] hover:ring-4 hover:ring-[#be7b3b]/20") 
                      : "border-[#e5e0d8] hover:border-[#be7b3b] hover:ring-4 hover:ring-[#be7b3b]/10"
                  }`}
                >
                  <img 
                    src={`/cms-media/original/${file}`} 
                    alt={file}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                  {handlingSwap && swapSource && ! (file === swapSource) && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                      <Loader2 className="w-6 h-6 animate-spin text-[#be7b3b]" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end">
                      {!swapSource && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteClick(e, file)}
                          disabled={deleting === file}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-red-500 text-white backdrop-blur-md transition-all"
                          title="Delete image"
                        >
                          {deleting === file ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-white font-medium truncate w-full">{file}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Confirmation Overlay */}
        {confirmDelete && (() => {
          const isDeleting = deleting === confirmDelete;
          const isBlocked = !!error && error.includes("currently in use") && confirmDelete === lastAttemptedDelete;

          return (
            <div className="absolute inset-0 z-50 bg-[#1a1714]/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-[#e5e0d8] flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  isBlocked ? "bg-amber-50 text-amber-500" : "bg-red-50 text-red-500"
                }`}>
                  {isBlocked ? <AlertTriangle className="w-10 h-10" /> : <Trash2 className="w-10 h-10" />}
                </div>
                
                <h4 className="text-xl font-bold text-[#1a1714] mb-2">
                  {isBlocked ? "Asset in Use" : "Delete Asset?"}
                </h4>
                
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  {isBlocked ? (
                    <>
                      This asset <span className="font-bold text-[#1a1714]">"{confirmDelete}"</span> is currently used on other pages. You must swap it with another image before you can delete it.
                    </>
                  ) : (
                    <>
                      Are you sure you want to delete <span className="font-bold text-[#1a1714]">"{confirmDelete}"</span>? All responsive versions will be removed. This action cannot be undone.
                    </>
                  )}
                </p>

                {isBlocked && (
                  <div className="w-full p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-8 text-left">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-amber-800 mb-1">System Message</p>
                    <p className="text-[11px] text-amber-700 font-medium leading-relaxed">{error}</p>
                  </div>
                )}
                
                <div className="w-full flex flex-col gap-3">
                  {isBlocked ? (
                    <button
                      onClick={() => {
                        setSwapSource(confirmDelete);
                        setConfirmDelete(null);
                        setError(null);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-[#be7b3b] text-white font-bold hover:bg-[#a66a32] transition-all shadow-lg shadow-[#be7b3b]/20 flex items-center justify-center gap-2"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      Swap & Delete Instead
                    </button>
                  ) : (
                    <button
                      onClick={() => executeDelete(confirmDelete)}
                      disabled={isDeleting}
                      className="w-full py-3.5 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Checking Usage...
                        </>
                      ) : (
                        "Permanently Delete"
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setConfirmDelete(null);
                      setError(null);
                    }}
                    disabled={isDeleting}
                    className="w-full py-3.5 rounded-2xl bg-gray-50 text-gray-400 font-bold hover:bg-gray-100 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
