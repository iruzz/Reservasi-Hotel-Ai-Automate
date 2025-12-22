import heroVilla from '@/assets/hero-villa.jpg';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center pt-24 pb-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-2">
              <span className="inline-block px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground font-medium">
                Boutique Villa Experience
              </span>
            </div>
            
            <h1 className="heading-display text-foreground">
              Ketenangan Tanpa Batas,{' '}
              <span className="text-primary">Dilayani dengan Cerdas.</span>
            </h1>
            
            <p className="body-large max-w-lg">
              Temukan pengalaman menginap mewah dengan pelayanan AI yang memahami 
              setiap kebutuhan Anda. Asmaralaya Escape, di mana ketenangan bertemu teknologi.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#rooms" className="btn-primary">
                Jelajahi Kamar
              </a>
              <a href="#facilities" className="btn-secondary">
                Lihat Fasilitas
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="animate-fade-up stagger-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/10 rounded-[2rem] blur-2xl" />
              <img
                src={heroVilla}
                alt="Luxury villa bedroom with tropical garden view"
                className="relative rounded-[2rem] w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover shadow-elevated"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 glass-strong rounded-3xl p-5 shadow-soft animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">98% Rating</p>
                    <p className="text-sm text-muted-foreground">Kepuasan Tamu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
