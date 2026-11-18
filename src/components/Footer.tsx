"use client";

export default function Footer() {
  return (
    <footer className="bg-plum text-cream pt-20 pb-12 relative overflow-hidden">
      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b-2 border-cream/20">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime text-dark flex items-center justify-center font-black text-sm">
                C
              </span>
              <span className="font-display font-black text-3xl tracking-tight text-white">
                COMPANION<span className="text-coral">®</span>
              </span>
            </div>
            
            <p className="text-sm font-medium text-cream/70 max-w-sm leading-relaxed">
              A curated Gen Z culture platform connecting verified adults for platonic companionship, photo walks, music gigs, and city discoveries.
            </p>

            <div className="pt-2">
              <span className="sticker bg-lime text-dark text-[10px]">
                KOLKATA // CULTURE PLATFORM
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <p className="font-mono text-xs font-bold text-lime uppercase tracking-widest">
                EXPLORE
              </p>
              <ul className="space-y-2 text-sm font-display font-bold">
                <li><a href="#discover" className="hover:text-coral transition-colors">DISCOVER</a></li>
                <li><a href="#vibe" className="hover:text-coral transition-colors">EXPERIENCES</a></li>
                <li><a href="#city" className="hover:text-coral transition-colors">CITY MAP</a></li>
                <li><a href="#journal" className="hover:text-coral transition-colors">THE EDIT</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-xs font-bold text-coral uppercase tracking-widest">
                TRUST & LEGAL
              </p>
              <ul className="space-y-2 text-sm font-display font-bold">
                <li><a href="#safety" className="hover:text-lime transition-colors">SAFETY PROTOCOL</a></li>
                <li><a href="#terms" className="hover:text-lime transition-colors">18+ GUIDELINES</a></li>
                <li><a href="#privacy" className="hover:text-lime transition-colors">PRIVACY POLICY</a></li>
                <li><a href="#terms" className="hover:text-lime transition-colors">TERMS OF USE</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-xs font-bold text-lavender uppercase tracking-widest">
                COMMUNITY
              </p>
              <ul className="space-y-2 text-sm font-display font-bold">
                <li><a href="#become" className="hover:text-coral transition-colors">BECOME A COMPANION</a></li>
                <li><a href="#support" className="hover:text-coral transition-colors">MEMBER SUPPORT</a></li>
                <li><a href="#instagram" className="hover:text-coral transition-colors">INSTAGRAM</a></li>
                <li><a href="#tiktok" className="hover:text-coral transition-colors">TIKTOK</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Giant Brand Wordmark */}
        <div className="pt-12 pb-6 text-center overflow-hidden">
          <p className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] tracking-tighter text-white/10 select-none leading-none">
            COMPANION
          </p>
        </div>

        {/* Copyright strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream/50 pt-4">
          <p>© 2026 COMPANION PLATFORM INC. ALL RIGHTS RESERVED.</p>
          <p className="text-lime font-bold">STRICTLY PLATONIC & 18+ VERIFIED</p>
        </div>

      </div>
    </footer>
  );
}
