import { useState, useEffect } from 'react';
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

const fallbackImages: { [key: string]: string } = {
  deluxe: roomDeluxe,
  suite: roomSuite,
  villa: roomVilla,
};

const RoomImageCarousel = ({ images, roomName, roomSlug }: { 
  images: RoomImage[] | undefined; 
  roomName: string;
  roomSlug: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages = images && images.length > 0 
    ? images.filter(img => img.url) 
    : [];

  const displayImages = validImages.length > 0 
    ? validImages 
    : [{ id: 0, url: fallbackImages[roomSlug] || roomDeluxe, alt: roomName, type: 'main' as const }];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url;
    }
    
    if (url.startsWith('/storage/')) {
      return `http://localhost:8000${url}`;
    }
    
    return `http://localhost:8000/storage/${url}`;
  };

  return (
    <div className="relative h-64 overflow-hidden group/carousel">
      <img
        src={getImageUrl(displayImages[currentIndex].url)}
        alt={displayImages[currentIndex].alt || roomName}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          console.error('Image load error:', displayImages[currentIndex].url);
          e.currentTarget.src = roomDeluxe;
        }}
      />

      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {displayImages.length > 1 && (
        <div className="absolute top-2 left-2 glass-strong rounded-full px-2 py-1">
          <span className="text-xs text-foreground font-medium">
            {currentIndex + 1}/{displayImages.length}
          </span>
        </div>
      )}
    </div>
  );
};

const RoomShowcase = ({ onQuickBook }: RoomShowcaseProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const data = await response.json();

      if (data.success) {
        setRooms(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Gagal memuat data kamar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => setSelectedRoom(null), 300);
  };

  // Loading State
  if (loading) {
    return (
      <section id="rooms" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground font-medium mb-6">
              Akomodasi
            </span>
            <h2 className="heading-section text-foreground mb-4">
              Pilih Tempat Istirahat Anda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-elevated overflow-hidden animate-pulse">
                <div className="h-64 bg-secondary"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-secondary rounded w-3/4"></div>
                  <div className="h-4 bg-secondary rounded w-full"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-secondary rounded w-16"></div>
                    <div className="h-6 bg-secondary rounded w-20"></div>
                    <div className="h-6 bg-secondary rounded w-16"></div>
                  </div>
                  <div className="h-10 bg-secondary rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section id="rooms" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={fetchRooms}
              className="btn-primary"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (rooms.length === 0) {
    return (
      <section id="rooms" className="section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground font-medium mb-6">
            Akomodasi
          </span>
          <h2 className="heading-section text-foreground mb-4">
            Pilih Tempat Istirahat Anda
          </h2>
          <p className="text-muted-foreground">
            Belum ada kamar tersedia saat ini.
          </p>
        </div>
      </section>
    );
  }

  // Main Content
  return (
    <>
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
                {/* Image Carousel */}
                <div className="relative">
                  <RoomImageCarousel 
                    images={room.images} 
                    roomName={room.name}
                    roomSlug={room.slug}
                  />
                  
                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 glass-strong rounded-2xl px-4 py-2">
                    <span className="font-semibold text-foreground text-sm">
                      {formatPrice(room.price_per_night)}
                    </span>
                    <span className="text-muted-foreground text-xs">/malam</span>
                  </div>

                  {/* Available Rooms Badge */}
                  {room.available_rooms > 0 && room.available_rooms <= 5 && (
                    <div className="absolute bottom-4 left-4 glass-strong rounded-full px-3 py-1">
                      <span className="text-xs text-foreground font-medium">
                        Hanya {room.available_rooms} kamar tersisa!
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      {room.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {room.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {/* Max Capacity */}
                    <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                      Max {room.max_capacity} Tamu
                    </span>

                    {/* Additional Features (show first 2) */}
                    {room.additional_features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}

                    {/* Show count if more features */}
                    {room.additional_features.length > 2 && (
                      <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                        +{room.additional_features.length - 2} lainnya
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(room)}
                      className="flex-1 flex items-center justify-center gap-2 btn-secondary group/btn"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Detail</span>
                    </button>

                    {/* Quick Book Button */}
                    <button
                      onClick={() => onQuickBook(room)}
                      disabled={room.available_rooms === 0}
                      className={`flex-1 flex items-center justify-center gap-2 group/btn ${
                        room.available_rooms === 0
                          ? 'btn-secondary opacity-50 cursor-not-allowed'
                          : 'btn-primary'
                      }`}
                    >
                      <span>
                        {room.available_rooms === 0 ? 'Sold Out' : 'Book'}
                      </span>
                      {room.available_rooms > 0 && (
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Detail Modal */}
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