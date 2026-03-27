"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateWebsitePage } from "./actions";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  page: {
    id: string;
    page_key: string;
    title: string;
    body_json: any;
  };
};

export function WebsitePageForm({ page }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // We use the JSON directly for simplicity in this MVP CMS
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: page.title,
      ...page.body_json
    }
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    setIsSaving(true);
    setError(null);

    const { title, ...body_json } = data;
    
    const result = await updateWebsitePage(page.id, {
      title,
      body_json
    });

    setIsSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
      router.push("/app/settings/website");
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-[#e5e0d8] bg-white text-sm transition-colors outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] hover:border-gray-300";
  const labelClass = "block text-sm font-semibold text-[#1a1714] mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/app/settings/website" 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1714]">Edit {page.title} Page</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#e5e0d8] bg-gray-50/50">
            <h2 className="font-bold text-[#1a1714]">General Settings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-2 max-w-md">
              <label htmlFor="title" className={labelClass}>Admin Display Title</label>
              <input id="title" {...register("title")} className={inputClass} placeholder="Home" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#e5e0d8] bg-gray-50/50">
            <h2 className="font-bold text-[#1a1714]">Page Content</h2>
          </div>
          <div className="p-6 space-y-8">
            {/* Dynamic fields based on page_key */}
            {page.page_key === 'home' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="hero_title" className={labelClass}>Hero Title</label>
                    <input id="hero_title" {...register("hero_title")} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="hero_image" className={labelClass}>Hero Image Path</label>
                    <input id="hero_image" {...register("hero_image")} className={inputClass} placeholder="/images/website/home-hero.jpg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="hero_subtitle" className={labelClass}>Hero Subtitle</label>
                  <textarea id="hero_subtitle" {...register("hero_subtitle")} rows={3} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="intro_text" className={labelClass}>Intro Text Body</label>
                  <textarea id="intro_text" {...register("intro_text")} rows={6} className={inputClass} />
                </div>
              </div>
            )}

            {page.page_key === 'contact' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="description" className={labelClass}>Intro Description</label>
                  <textarea id="description" {...register("description")} rows={3} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className={labelClass}>Email address</label>
                    <input id="email" {...register("email")} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className={labelClass}>Phone number</label>
                    <input id="phone" {...register("phone")} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="address" className={labelClass}>Physical Address</label>
                    <input id="address" {...register("address")} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="instagram" className={labelClass}>Instagram Handle</label>
                    <input id="instagram" {...register("instagram")} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Default fallback for other pages (Bags, Materials, Events) */}
            {!['home', 'contact'].includes(page.page_key) && (
              <div className="space-y-6">
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">Dynamic Editor Pending</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      The rich editor for the <strong>{page.page_key}</strong> page is currently being modularized. 
                      You can update the primary title above, and we will preserve the existing structured JSON data 
                      from your migration for the body sections.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-6 py-6 border-t border-[#e5e0d8] bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
            {error ? (
              <p role="alert" className="text-sm text-red-600 font-medium">{error}</p>
            ) : (
              <p className="text-xs text-gray-400">All changes are immediately reflected on the public website.</p>
            )}
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-semibold text-gray-700 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-semibold hover:bg-[#a86330] disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
