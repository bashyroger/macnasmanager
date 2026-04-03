import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import Image from "next/image";
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
    <div className="bg-[#171717] min-h-screen">
       {/* Top Intro Section */}
       <section className="bg-transparent border-b border-white/5 py-32 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
            Contact Studio Macnas
          </h1>
          <p className="text-xl text-[#a9a9a9] leading-relaxed mx-auto max-w-2xl">
            {body_json.description || "Should we meet? Can we work together? Don't hesitate to contact us. Because together, we can change the patterns of the fashion world."}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <a href={`https://wa.me/${body_json.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-[#fafA00] text-[#fafA00] font-black uppercase text-sm tracking-widest hover:bg-[#fafA00] hover:text-black transition-colors w-full md:w-auto">
               Chat on Whatsapp
            </a>
            <a href={`https://www.instagram.com/${body_json.instagram}/`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-[#fafA00] text-[#fafA00] font-black uppercase text-sm tracking-widest hover:bg-[#fafA00] hover:text-black transition-colors w-full md:w-auto">
               Follow on Instagram
            </a>
            <a href="https://www.linkedin.com/in/belindawerschkull/" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-[#fafA00] text-[#fafA00] font-black uppercase text-sm tracking-widest hover:bg-[#fafA00] hover:text-black transition-colors w-full md:w-auto">
               Follow on LinkedIn
            </a>
          </div>
       </section>

       {/* Let's Collaborate & Form */}
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
         <div className="grid md:grid-cols-2 gap-24">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-black tracking-tighter uppercase leading-[1.1]">
                 Let's Collaborate!
              </h1>
              <h3 className="text-xl text-[#fafA00] font-medium tracking-wide">
                 Drop me a line! Together we can change the patterns of the fashion world.
              </h3>
              <div className="pt-8 space-y-6">
                 <div>
                    <a href={`mailto:${body_json.email}`} className="block text-white text-lg font-black uppercase tracking-widest underline decoration-white/30 underline-offset-4 hover:decoration-[#fafA00] transition-colors">{body_json.email}</a>
                    <a href={`tel:${body_json.phone?.replace(/ /g,'')}`} className="block text-white text-lg font-black uppercase tracking-widest underline decoration-white/30 underline-offset-4 hover:decoration-[#fafA00] transition-colors mt-2">{body_json.phone}</a>
                 </div>
                 <div className="pt-4">
                    <p className="text-white text-lg font-black uppercase tracking-widest">{body_json.address?.split(',')[0] || "Kanaalweg 30"}</p>
                    <p className="text-white text-lg font-black uppercase tracking-widest">{body_json.address?.split(',')[1] || "3526 KM Utrecht"}</p>
                 </div>
              </div>
            </div>

            {/* Form Dummy UI matching Legacy structure */}
            <div className="bg-[#111] p-8 md:p-12 rounded-sm border border-white/5 shadow-2xl">
               {/* Client action is deliberately empty for now, form only functional later if needed */}
               <form className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-white font-medium text-sm tracking-wide">Your name</label>
                     <input type="text" name="Name" className="w-full bg-[#1a1a1a] border border-white/10 p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#fafA00] transition-colors" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-white font-medium text-sm tracking-wide">Your email <span className="text-[#fafA00]">*</span></label>
                     <input type="email" name="senderEmail" required className="w-full bg-[#1a1a1a] border border-white/10 p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#fafA00] transition-colors" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-white font-medium text-sm tracking-wide">Your message</label>
                     <textarea name="Message" rows={5} className="w-full bg-[#1a1a1a] border border-white/10 p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#fafA00] transition-colors resize-none"></textarea>
                  </div>
                  <div className="pt-4 flex justify-end">
                     <button type="button" className="inline-block px-12 py-4 bg-[#fafA00] text-black font-black uppercase tracking-widest hover:bg-white transition-colors">
                        Send
                     </button>
                  </div>
               </form>
            </div>
         </div>
       </section>

       {/* Full-width Image Bottom */}
       <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[500px] bg-[#0a0a0a]">
          <Image 
             src="/cms-media/original/Studio-Macnas-WNDRLST-site-16JPG.jpg" 
             alt="Studio Macnas Contact" 
             fill
             className="object-cover object-[center_25%]"
          />
       </section>
    </div>
  );
}
