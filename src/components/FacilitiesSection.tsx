import { Wifi, Car, Utensils, Sparkles, Dumbbell, Leaf } from 'lucide-react';

import facilityWifi from '@/assets/facility-wifi.jpg';
import facilityTransfer from '@/assets/facility-transfer.jpg';
import facilityDining from '@/assets/facility-dining.jpg';
import facilitySpa from '@/assets/facility-spa.jpg';
import facilityGym from '@/assets/facility-gym.jpg';
import facilityGarden from '@/assets/facility-garden.jpg';

const facilities = [
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Koneksi internet cepat di seluruh area.',
    image: facilityWifi,
  },
  {
    icon: Car,
    title: 'Airport Transfer',
    description: 'Layanan antar-jemput bandara.',
    image: facilityTransfer,
  },
  {
    icon: Utensils,
    title: 'Farm-to-Table Dining',
    description: 'Restoran dengan bahan organik lokal.',
    image: facilityDining,
  },
  {
    icon: Sparkles,
    title: 'Spa & Wellness',
    description: 'Perawatan tubuh tradisional Bali.',
    image: facilitySpa,
  },
  {
    icon: Dumbbell,
    title: 'Fitness Center',
    description: 'Gym modern dengan peralatan lengkap.',
    image: facilityGym,
  },
  {
    icon: Leaf,
    title: 'Tropical Garden',
    description: 'Taman tropis yang asri dan menenangkan.',
    image: facilityGarden,
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
              className={`group bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-border/50 
                         transition-all duration-300 hover:shadow-soft hover:-translate-y-1
                         animate-fade-up stagger-${index + 1}`}
            >
              {/* Facility Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                  <facility.icon className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              
              {/* Facility Content */}
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {facility.title}
                </h3>
                <p className="text-muted-foreground text-sm">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
