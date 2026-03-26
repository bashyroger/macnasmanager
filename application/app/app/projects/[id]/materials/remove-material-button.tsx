"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function RemoveMaterialButton({ id, projectId }: { id: string; projectId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    if (!confirm("Remove this material from the project? This cannot be undone.")) return;
    setLoading(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("project_materials") as any).delete().eq("id", id);
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      title="Remove material"
      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
