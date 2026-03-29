"use client";

import { useState, useEffect } from "react";
import { 
  Loader2, Search, X, Upload, Image as ImageIcon
} from "lucide-react";
import { getMediaLibrary, uploadMedia } from "@/app/app/settings/website/actions";

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
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadMedia(formData);

    if (result.error) {
      setUploadError(result.error);
    } else {
      await fetchMedia();
    }
    setUploading(false);
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
            <h3 className="text-lg font-bold text-[#1a1714]">Media Library</h3>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">Select an asset from /cms-media/original</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
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

        {uploadError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 font-medium">
            Error: {uploadError}
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
                <button
                  key={file}
                  type="button"
                  onClick={() => onSelect(`/cms-media/original/${file}`)}
                  className="group relative aspect-square rounded-2xl border border-[#e5e0d8] overflow-hidden hover:border-[#be7b3b] hover:ring-4 hover:ring-[#be7b3b]/10 transition-all text-left bg-[#fcfaf8]"
                >
                  <img 
                    src={`/cms-media/original/${file}`} 
                    alt={file}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-[10px] text-white font-medium truncate w-full">{file}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
