import { Wifi, Car, Utensils, Sparkles, Dumbbell, Leaf } from 'lucide-react';

const facilities = [
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Koneksi internet cepat di seluruh area.',
  },
  {
    icon: Car,
    title: 'Airport Transfer',
    description: 'Layanan antar-jemput bandara.',
  },
  {
    icon: Utensils,
    title: 'Farm-to-Table Dining',
    description: 'Restoran dengan bahan organik lokal.',
  },
  {
    icon: Sparkles,
    title: 'Spa & Wellness',
    description: 'Perawatan tubuh tradisional Bali.',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Center',
    description: 'Gym modern dengan peralatan lengkap.',
  },
  {
    icon: Leaf,
    title: 'Tropical Garden',
    description: 'Taman tropis yang asri dan menenangkan.',
  },
];

const FacilitiesSection = () => {
  return (
    <section id="facilities" className="section-padding bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-2 bg-card rounded-full text-sm text-muted-foreground font-medium mb-6">
            Fasilitas
          </span>
          <h2 className="heading-section text-foreground mb-4">
            Fasilitas Premium untuk Kenyamanan Anda
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Nikmati berbagai fasilitas eksklusif yang dirancang untuk memanjakan setiap tamu.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={facility.title}
              className={`bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-border/50 
                         transition-all duration-300 hover:shadow-soft hover:-translate-y-1
                         animate-fade-up stagger-${index + 1}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <facility.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {facility.title}
              </h3>
              <p className="text-muted-foreground text-sm">{facility.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
