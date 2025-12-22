import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onBookNowClick: () => void;
}

const Navbar = ({ onBookNowClick }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-strong shadow-soft py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-semibold text-foreground tracking-tight">
            Asmaralaya
          </span>
          <span className="text-muted-foreground font-light">Escape</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#rooms" className="btn-ghost text-sm">
            Explore
          </a>
          <a href="#facilities" className="btn-ghost text-sm">
            Facilities
          </a>
          <button onClick={onBookNowClick} className="btn-primary text-sm">
            Book Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-2xl hover:bg-secondary/60 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong mt-2 mx-4 rounded-3xl p-6 animate-slide-up">
          <div className="flex flex-col gap-4">
            <a
              href="#rooms"
              className="text-foreground py-3 px-4 rounded-2xl hover:bg-secondary/60 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </a>
            <a
              href="#facilities"
              className="text-foreground py-3 px-4 rounded-2xl hover:bg-secondary/60 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Facilities
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onBookNowClick();
              }}
              className="btn-primary text-center"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
