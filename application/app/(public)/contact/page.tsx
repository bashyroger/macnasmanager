import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import Link from "next/link";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("website_pages")
    .select("*")
    .eq("page_key", "contact")
    .single();

  if (!page) return notFound();

  const body_json = page.body_json as any;

  return (
    <div className="bg-[#171717] min-h-screen py-24 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="w-12 h-1 bg-[#fafA00] mb-8" />
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-8 leading-none">
              {body_json.title || "Contact"}
            </h1>
            <p className="text-[#a9a9a9] text-2xl leading-relaxed mb-12 max-w-xl">
              {body_json.description}
            </p>

            <div className="space-y-8">
              <a href={`mailto:${body_json.email}`} className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-[#000000] border border-white/10 flex items-center justify-center text-[#ef5cff] group-hover:bg-[#ef5cff] group-hover:text-black transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-white font-bold text-xl">{body_json.email}</span>
              </a>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#000000] border border-white/10 flex items-center justify-center text-[#ef5cff]">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-white font-bold text-xl">{body_json.phone}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#000000] border border-white/10 flex items-center justify-center text-[#ef5cff]">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-white font-bold text-xl leading-tight">{body_json.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#000000] p-12 border border-white/5 rounded-2xl space-y-8">
             <h3 className="text-[#fafA00] font-black uppercase text-xs tracking-widest">Connect on Social</h3>
             <p className="text-[#a9a9a9] text-sm leading-relaxed italic">
               Follow our journey and see the latest co-creations unfolding in the studio.
             </p>
             <Link 
               href={`https://instagram.com/${body_json.instagram}`} 
               target="_blank"
               className="flex items-center justify-between w-full p-6 bg-[#171717] border border-white/10 hover:border-[#fafA00] transition-all group"
             >
                <div className="flex items-center gap-4">
                   <Globe className="w-8 h-8 text-white group-hover:text-[#fafA00]" />
                  <span className="text-white font-black text-lg">@{body_json.instagram}</span>
                </div>
                <ArrowRight className="w-6 h-6 text-[#ef5cff]" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
