import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Users, Bed, Maximize2, MapPin } from 'lucide-react';

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

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onBook: (room: Room) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/storage/')) return `http://localhost:8000${url}`;
  return `http://localhost:8000/storage/${url}`;
};

const RoomDetailModal = ({ isOpen, onClose, room, onBook }: RoomDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !room) return null;

  const images = room.images && room.images.length > 0 
    ? room.images 
    : room.main_image 
      ? [room.main_image] 
      : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBook = () => {
    onBook(room);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-[#FAFAF8] rounded-none md:rounded-3xl shadow-2xl animate-slide-up overflow-hidden max-h-screen flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        >
          <X className="w-5 h-5 text-[#4A4A4A]" />
        </button>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1">
          {/* Large Hero Image Section */}
          <div className="relative h-[50vh] md:h-[400px] bg-[#EDE9DC]">
            {images.length > 0 ? (
              <>
                <img
                  src={getImageUrl(images[currentImageIndex].url)}
                  alt={images[currentImageIndex].alt || room.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image';
                  }}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm text-[#4A4A4A] flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm text-[#4A4A4A] flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image Counter Badge */}
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-md">
                      <span className="text-[#4A4A4A] text-sm font-medium">
                        {currentImageIndex + 1}/{images.length}
                      </span>
                    </div>

                    {/* Dot Navigation */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? 'bg-white w-8'
                              : 'bg-white/60 w-2 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8A8A8A]">
                <div className="text-center">
                  <Maximize2 className="w-16 h-16 mx-auto mb-2 opacity-20" />
                  <p>Tidak ada gambar tersedia</p>
                </div>
              </div>
            )}
          </div>

          {/* Room Details Section */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#3A3A3A] mb-4">
              {room.name}
            </h2>

            {/* Quick Info Icons */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#6A6A6A] mb-4 pb-4 border-b border-[#E5E1D8]">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#7A8B6B]" />
                <span>King Size Bed</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7A8B6B]" />
                <span>Max {room.max_capacity} Tamu</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5 text-[#7A8B6B]" />
                <span>48m²</span>
              </div>
            </div>

            {/* Feature Badges */}
            {room.additional_features.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {room.additional_features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-[#F5F1E8] text-[#5A5A5A] text-sm rounded-full font-medium border border-[#E5E1D8]"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <p className="text-[#5A5A5A] leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Availability Warning */}
            {room.available_rooms > 0 && room.available_rooms <= 5 && (
              <div className="mb-6 p-4 bg-[#FFF5E6] border border-[#F0D9B8] rounded-2xl">
                <p className="text-[#8B6914] font-medium">
                  ⚠️ Hanya tersisa {room.available_rooms} kamar dengan harga ini
                </p>
              </div>
            )}

            {/* Location Info */}
            <div className="flex items-start gap-3 p-4 bg-[#F5F1E8] rounded-2xl mb-6 border border-[#E5E1D8]">
              <MapPin className="w-5 h-5 text-[#7A8B6B] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[#3A3A3A] mb-1">
                  Asmaralaya Escape, Ubud
                </p>
                <p className="text-sm text-[#6A6A6A]">
                  Lokasi strategis di pusat Ubud, 10 menit dari Monkey Forest
                </p>
              </div>
            </div>

            {/* Policies */}
            <div className="border-t border-[#E5E1D8] pt-6">
              <h3 className="font-semibold text-[#3A3A3A] mb-4">Kebijakan Kamar</h3>
              <div className="space-y-3 text-sm text-[#6A6A6A]">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7A8B6B] mt-2 shrink-0"></div>
                  <span>Check-in dari 14:00 | Check-out hingga 12:00</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7A8B6B] mt-2 shrink-0"></div>
                  <span>Pembatalan gratis hingga 24 jam sebelum check-in</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7A8B6B] mt-2 shrink-0"></div>
                  <span>Dilarang merokok di dalam kamar</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7A8B6B] mt-2 shrink-0"></div>
                  <span>Hewan peliharaan tidak diperbolehkan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed bottom with CTA */}
        <div className="border-t border-[#E5E1D8] bg-[#FAFAF8] p-4 md:p-6 shrink-0">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Price */}
            <div>
              <p className="text-sm text-[#8A8A8A] mb-1">Harga per malam mulai dari</p>
              <p className="text-2xl md:text-3xl font-bold text-[#3A3A3A]">
                {formatPrice(room.price_per_night)}
              </p>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBook}
              disabled={room.available_rooms === 0}
              className={`px-8 py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                room.available_rooms === 0
                  ? 'bg-[#E5E1D8] text-[#8A8A8A] cursor-not-allowed'
                  : 'bg-[#7A8B6B] text-white hover:bg-[#6B7A5B] shadow-lg hover:shadow-xl'
              }`}
            >
              <span>{room.available_rooms === 0 ? 'Sold Out' : 'Book'}</span>
              {room.available_rooms > 0 && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;