"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleProjectPublish } from "../../actions";

export function PublishToggle({ projectId, isPublished, isReady }: { projectId: string; isPublished: boolean; isReady: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isReady && !isPublished) return; // Cannot publish if not ready
    
    setLoading(true);
    const result = await toggleProjectPublish(projectId, !isPublished);
    setLoading(false);
    
    if (!result.error) {
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-[#e5e0d8] bg-[#faf9f7]">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[#1a1714]">
          {isPublished ? "Publicly Visible" : "Private (Draft)"}
        </span>
        <span className="text-xs text-gray-500 mt-0.5">
          {isPublished ? "This project is live on the showcase." : "This project is hidden from the public."}
        </span>
      </div>
      
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading || (!isReady && !isPublished)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#be7b3b] focus:ring-offset-2 ${
          isPublished ? "bg-green-500" : "bg-gray-200"
        } ${(!isReady && !isPublished) ? "opacity-50 cursor-not-allowed" : ""}`}
        role="switch"
        aria-checked={isPublished}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isPublished ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
