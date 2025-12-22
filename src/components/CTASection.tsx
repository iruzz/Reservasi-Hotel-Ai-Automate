import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onBookNowClick: () => void;
}

const CTASection = ({ onBookNowClick }: CTASectionProps) => {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Rating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full mb-8 animate-fade-up">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-accent text-accent" />
            ))}
          </div>
          <span className="text-sm text-primary-foreground/90 font-medium">
            Rated 4.9/5 by 500+ guests
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 animate-fade-up">
          Siap Merasakan Ketenangan
          <br />
          <span className="text-accent">di Asmaralaya Escape?</span>
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-up">
          Pesan sekarang dan dapatkan pengalaman menginap tak terlupakan dengan layanan AI concierge 24 jam.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
          <Button
            onClick={onBookNowClick}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Reservasi Sekarang
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat via WhatsApp
          </a>
        </div>

        {/* Trust Note */}
        <p className="mt-8 text-sm text-primary-foreground/60 animate-fade-up">
          ✓ Pembatalan gratis hingga 24 jam sebelum check-in
        </p>
      </div>
    </section>
  );
};

export default CTASection;
