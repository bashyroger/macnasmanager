import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function PublicHomePage() {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("website_pages")
    .select("*")
    .eq("page_key", "home")
    .single();

  if (!page) return notFound();

  const body_json = page.body_json as any;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={body_json.hero_image || "/images/website/home-hero.jpg"}
            alt="Hero background"
            fill
            className="object-cover object-[50%_35%] opacity-90"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center mt-32 md:mt-48">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-tight uppercase drop-shadow-lg">
              {body_json.hero_title}
            </h1>
            <p className="text-lg text-white font-medium mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow">
              {body_json.hero_subtitle}
            </p>
          </div>
        </div>

        {/* Brand Slogan */}
        <div className="absolute bottom-12 right-8 hidden lg:block">
          <span className="text-[#ef5cff] text-2xl font-medium italic tracking-tight">
            Rethinking fashion patterns
          </span>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bg-[#000000] py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 item-start">
            <div>
              <h2 className="text-3xl md:text-5xl font-medium text-white leading-tight">
                {body_json.intro_title}
              </h2>
            </div>
            <div className="text-[#a9a9a9] text-xl leading-relaxed whitespace-pre-wrap space-y-6">
              {body_json.intro_text}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="bg-[#000000]">
        {body_json.sections?.map((section: any, idx: number) => {
          const isImageRight = section.imageAlign === "right";
          return (
            <section key={idx} className={`flex flex-col ${isImageRight ? "md:flex-row" : "md:flex-row-reverse"} min-h-[60vh] bg-[#171717] items-center`}>
              <div className="flex-1 flex flex-col justify-center px-8 py-20 lg:px-24 w-full">
                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">{section.title}</h2>
                <h3 className="text-2xl md:text-4xl font-medium text-[#ef5cff] mb-8 leading-tight">
                  {section.subtitle}
                </h3>
                <div className="text-[#a9a9a9] text-lg leading-relaxed whitespace-pre-wrap mb-10">
                  {section.text}
                </div>
                <Link href={section.linkUrl || "#"} className="inline-flex py-4 px-8 border-2 border-white text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors self-start">
                  {section.linkBtn}
                </Link>
              </div>
              <div className="flex-1 w-full lg:p-12 p-8">
                <div className="relative w-full aspect-[4/3] rounded overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Newsletter */}
      <section className="bg-[#171717] py-32 border-t border-b border-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">{body_json.newsletter_title}</h2>
          <p className="text-[#a9a9a9] text-xl font-medium mb-12">{body_json.newsletter_text}</p>
          <form className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex-1 text-left">
              <label className="block text-sm font-black uppercase tracking-widest text-[#ef5cff] mb-2">Naam</label>
              <input type="text" className="w-full bg-transparent border-b-2 border-white/20 p-2 text-white focus:outline-none focus:border-[#fafA00] transition-colors" />
            </div>
            <div className="flex-1 text-left">
              <label className="block text-sm font-black uppercase tracking-widest text-[#ef5cff] mb-2">E-mail</label>
              <input type="email" className="w-full bg-transparent border-b-2 border-white/20 p-2 text-white focus:outline-none focus:border-[#fafA00] transition-colors" />
            </div>
            <button type="button" className="sm:self-end bg-[#fafA00] text-black px-8 py-3 font-black uppercase tracking-widest text-sm hover:bg-white transition-colors">
              Sign up
            </button>
          </form>
        </div>
      </section>

      {/* Outro */}
      <section className="bg-[#000000] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-8">{body_json.outro_title}</h2>
          <div className="text-[#a9a9a9] text-xl leading-relaxed whitespace-pre-wrap">
            {body_json.outro_text}
          </div>
        </div>
      </section>

      {/* Outro Image */}
      {body_json.outro_image && (
        <section className="bg-[#000000] pb-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full aspect-video md:aspect-[21/9]">
              <Image
                src={body_json.outro_image}
                alt="Outro Studio"
                fill
                className="object-cover rounded-md opacity-80"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
