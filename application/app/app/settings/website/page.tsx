import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default async function WebsiteSettingsPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("website_pages")
    .select("id, page_key, title, updated_at")
    .order("page_key");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1714]">Website CMS</h1>
        <p className="text-gray-500 text-sm">Manage the content and images of your public-facing website pages.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages?.map((page) => (
          <div key={page.id} className="bg-white rounded-2xl border border-[#e5e0d8] p-6 hover:border-[#be7b3b] transition-all group shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#faf9f7] flex items-center justify-center text-[#be7b3b]">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest bg-[#faf9f7] px-2 py-1 rounded-md">
                MODIFIED {new Date(page.updated_at).toLocaleDateString()}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-[#1a1714] capitalize mb-1">{page.title}</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Edit the headlines, body text, and image paths for the {page.page_key} page.
            </p>

            <Link 
              href={`/app/settings/website/${page.page_key}`} 
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-semibold text-gray-700 hover:bg-[#be7b3b] hover:text-white hover:border-[#be7b3b] transition-all group/btn"
            >
              Edit Content 
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
