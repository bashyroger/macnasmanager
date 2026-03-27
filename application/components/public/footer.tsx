import Link from "next/link";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#000000] border-t border-white/5 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#fafA00] flex items-center justify-center font-black text-black">
                M
              </div>
              <span className="text-xl font-bold tracking-tight">Studio Macnas</span>
            </div>
            <p className="text-[#a9a9a9] text-sm leading-relaxed max-w-xs">
              Transforming the fashion industry by creating unique, sustainable accessories and sharing the craft of conscious making.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#fafA00] font-bold text-xs uppercase tracking-widest mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/bags" className="text-sm text-[#a9a9a9] hover:text-white transition-colors">Custom Bags</Link></li>
              <li><Link href="/materials" className="text-sm text-[#a9a9a9] hover:text-white transition-colors">Materials</Link></li>
              <li><Link href="/projects" className="text-sm text-[#a9a9a9] hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/events" className="text-sm text-[#a9a9a9] hover:text-white transition-colors">Workshops</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#ef5cff] font-bold text-xs uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-[#a9a9a9]">
                <Mail className="w-4 h-4 text-[#ef5cff]" />
                belinda@studiomacnas.com
              </li>
              <li className="flex items-center gap-3 text-sm text-[#a9a9a9]">
                <Phone className="w-4 h-4 text-[#ef5cff]" />
                +31 6 45 43 65 15
              </li>
              <li className="flex items-center gap-3 text-sm text-[#a9a9a9]">
                <MapPin className="w-4 h-4 text-[#ef5cff]" />
                Kanaalweg 30, Utrecht
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 text-sm text-[#a9a9a9] hover:text-white transition-colors">
                  <Globe className="w-4 h-4 text-[#ef5cff]" />
                  @studiomacnas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Studio Macnas. All patterns reimagined.</p>
          <div className="flex gap-6">
            <Link href="/app" className="hover:text-white transition-colors">Dashboard Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
