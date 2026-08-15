import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, ArrowUp } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = [
    ["Events", "#events"],
    ["Services", "#services"],
    ["About", "#about"],
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container-page flex h-20 items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight text-white">eventManager<span className="text-orange-300">.</span></a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="text-sm text-white/80 transition hover:text-white">{label}</a>
          ))}
          <a href="#contact" className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-orange-100">
            Plan an event <ArrowUpRight size={16} />
          </a>
        </nav>

        <button className="text-white md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="mx-5 rounded-2xl bg-white text-black p-5 shadow-2xl md:hidden">
          {links.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)} className="block border-b border-black/5 py-3 font-medium">
              {label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="mt-4 block rounded-full bg-ink px-5 py-3 text-center font-semibold text-white">
            Plan an event
          </a>
        </div>
      )}

      {scrollY > 300 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 rounded-full bg-orange-600 p-3 sm:p-4 text-white shadow-lg transition-all duration-300 hover:bg-orange-700 hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} className="sm:w-6" />
        </button>
      )}
    </header>
  );
}
