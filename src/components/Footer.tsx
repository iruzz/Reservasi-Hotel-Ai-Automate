import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <span className="font-serif text-2xl font-semibold">Asmaralaya</span>
              <span className="text-background/60 font-light ml-2">Escape</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Boutique villa dengan pelayanan AI yang memahami setiap kebutuhan Anda.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Kontak</h4>
            <div className="space-y-3 text-background/60 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Jl. Raya Ubud No. 88, Gianyar, Bali 80571</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0" />
                <span>hello@asmaralaya.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Tautan</h4>
            <div className="space-y-2 text-background/60 text-sm">
              <a href="#rooms" className="block hover:text-background transition-colors">
                Akomodasi
              </a>
              <a href="#facilities" className="block hover:text-background transition-colors">
                Fasilitas
              </a>
              <a href="#" className="block hover:text-background transition-colors">
                Galeri
              </a>
              <a href="#" className="block hover:text-background transition-colors">
                Kebijakan Privasi
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold">Ikuti Kami</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center
                         hover:bg-background/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center
                         hover:bg-background/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center text-background/40 text-sm">
          <p>© 2024 Asmaralaya Escape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
