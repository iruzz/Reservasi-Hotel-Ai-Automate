import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import roomSuite from '@/assets/room-suite.jpg';
import roomDeluxe from '@/assets/room-deluxe.jpg';
import roomVilla from '@/assets/room-villa.jpg';
import RoomDetailModal from './RoomDetailModal';

interface RoomImage {
  id: number;
  url: string;
  alt: string;
  type: 'main' | 'gallery';
}

interface Room {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_per_night: number;
  max_capacity: number;
  available_rooms: number;
  additional_features: string[];
  main_image: RoomImage | null;
  images?: RoomImage[];
}

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

// ========== DUMMY DATA ==========
const dummyRooms: Room[] = [
  {
    id: 1,
    name: 'Deluxe Garden View',
    slug: 'deluxe',
    description: 'Kamar nyaman dengan pemandangan taman tropis yang asri. Dilengkapi dengan fasilitas modern dan desain yang elegan untuk pengalaman menginap yang tak terlupakan.',
    price_per_night: 1500000,
    max_capacity: 2,
    available_rooms: 5,
    additional_features: ['AC', 'TV LED 43"', 'Mini Bar', 'Balkon Privat', 'Wi-Fi Gratis', 'Safe Box'],
    main_image: { id: 1, url: roomDeluxe, alt: 'Deluxe Garden View', type: 'main' },
    images: [
      { id: 1, url: roomDeluxe, alt: 'Deluxe Garden View - Main', type: 'main' },
    ],
  },
  {
    id: 2,
    name: 'Pool Suite',
    slug: 'suite',
    description: 'Suite mewah dengan akses kolam renang privat. Nikmati kemewahan dan privasi dengan fasilitas lengkap untuk pasangan atau keluarga kecil.',
    price_per_night: 2800000,
    max_capacity: 4,
    available_rooms: 3,
    additional_features: ['Private Pool', 'Living Area', 'Kitchenette', 'Smart TV 55"', 'Jacuzzi', 'Butler Service'],
    main_image: { id: 2, url: roomSuite, alt: 'Pool Suite', type: 'main' },
    images: [
      { id: 2, url: roomSuite, alt: 'Pool Suite - Main', type: 'main' },
    ],
  },
  {
    id: 3,
    name: 'Royal Villa',
    slug: 'villa',
    description: 'Villa eksklusif dengan infinity pool dan pemandangan sawah yang memukau. Sempurna untuk liburan romantis atau keluarga dengan ruang yang luas dan privasi maksimal.',
    price_per_night: 4500000,
    max_capacity: 6,
    available_rooms: 2,
    additional_features: ['Infinity Pool', 'Full Kitchen', '2 Bedrooms', 'Outdoor Shower', 'Private Garden', 'BBQ Area'],
    main_image: { id: 3, url: roomVilla, alt: 'Royal Villa', type: 'main' },
    images: [
      { id: 3, url: roomVilla, alt: 'Royal Villa - Main', type: 'main' },
    ],
  },
];

const RoomImageCarousel = ({ images, roomName }: {
  images: RoomImage[] | undefined;
  roomName: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images && images.length > 0 ? images : [];

  if (displayImages.length === 0) return null;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="relative h-64 overflow-hidden group/carousel">
      <img
        src={displayImages[currentIndex].url}
        alt={displayImages[currentIndex].alt || roomName}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {displayImages.length > 1 && (
        <>
          <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70" aria-label="Previous image">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70" aria-label="Next image">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {displayImages.map((_, idx) => (
              <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'}`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const RoomShowcase = ({ onQuickBook }: RoomShowcaseProps) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const rooms = dummyRooms;

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => setSelectedRoom(null), 300);
  };

  return (
    <>
      <section id="rooms" className="section-padding">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div key={room.id} className={`card-elevated overflow-hidden group animate-fade-up stagger-${index + 1}`}>
                <div className="relative">
                  <RoomImageCarousel images={room.images} roomName={room.name} />

                  <div className="absolute top-4 right-4 glass-strong rounded-2xl px-4 py-2">
                    <span className="font-semibold text-foreground text-sm">{formatPrice(room.price_per_night)}</span>
                    <span className="text-muted-foreground text-xs">/malam</span>
                  </div>

                  {room.available_rooms > 0 && room.available_rooms <= 5 && (
                    <div className="absolute bottom-4 left-4 glass-strong rounded-full px-3 py-1">
                      <span className="text-xs text-foreground font-medium">Hanya {room.available_rooms} kamar tersisa!</span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{room.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{room.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">Max {room.max_capacity} Tamu</span>
                    {room.additional_features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">{feature}</span>
                    ))}
                    {room.additional_features.length > 2 && (
                      <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">+{room.additional_features.length - 2} lainnya</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleViewDetails(room)} className="flex-1 flex items-center justify-center gap-2 btn-secondary group/btn">
                      <Eye className="w-4 h-4" />
                      <span>Detail</span>
                    </button>
                    <button
                      onClick={() => onQuickBook(room)}
                      disabled={room.available_rooms === 0}
                      className={`flex-1 flex items-center justify-center gap-2 group/btn ${room.available_rooms === 0 ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                    >
                      <span>{room.available_rooms === 0 ? 'Sold Out' : 'Book'}</span>
                      {room.available_rooms > 0 && <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RoomDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        room={selectedRoom}
        onBook={onQuickBook}
      />
    </>
  );
};

export default RoomShowcase;
export type { Room, RoomImage };