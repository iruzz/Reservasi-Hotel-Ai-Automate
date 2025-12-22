import { ArrowRight } from 'lucide-react';
import roomSuite from '@/assets/room-suite.jpg';
import roomDeluxe from '@/assets/room-deluxe.jpg';
import roomVilla from '@/assets/room-villa.jpg';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
}

const rooms: Room[] = [
  {
    id: 'deluxe',
    name: 'Deluxe Garden View',
    description: 'Kamar nyaman dengan pemandangan taman tropis.',
    price: 1500000,
    image: roomDeluxe,
    features: ['35 m²', 'Garden View', 'King Bed'],
  },
  {
    id: 'suite',
    name: 'Pool Suite',
    description: 'Suite mewah dengan akses kolam renang privat.',
    price: 2800000,
    image: roomSuite,
    features: ['65 m²', 'Private Pool', 'Living Area'],
  },
  {
    id: 'villa',
    name: 'Royal Villa',
    description: 'Villa eksklusif dengan infinity pool dan pemandangan sawah.',
    price: 4500000,
    image: roomVilla,
    features: ['120 m²', 'Infinity Pool', 'Full Kitchen'],
  },
];

interface RoomShowcaseProps {
  onQuickBook: (room: Room) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const RoomShowcase = ({ onQuickBook }: RoomShowcaseProps) => {
  return (
    <section id="rooms" className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground font-medium mb-6">
            Akomodasi
          </span>
          <h2 className="heading-section text-foreground mb-4">
            Pilih Tempat Istirahat Anda
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Setiap kamar dirancang untuk memberikan pengalaman menginap yang tak terlupakan.
          </p>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className={`card-elevated overflow-hidden group animate-fade-up stagger-${index + 1}`}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Price Tag */}
                <div className="absolute top-4 right-4 glass-strong rounded-2xl px-4 py-2">
                  <span className="font-semibold text-foreground text-sm">
                    {formatPrice(room.price)}
                  </span>
                  <span className="text-muted-foreground text-xs">/malam</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {room.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{room.description}</p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Quick Book Button */}
                <button
                  onClick={() => onQuickBook(room)}
                  className="w-full btn-secondary flex items-center justify-center gap-2 group/btn"
                >
                  <span>Quick Book</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomShowcase;
export type { Room };
