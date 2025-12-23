import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import { ArrowRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import BookingBar from '@/components/BookingBar';
import RoomShowcase, { Room, RoomImage } from '@/components/RoomShowcase';
import RoomDetailModal from '@/components/RoomDetailModal';
import FacilitiesSection from '@/components/FacilitiesSection';
import CTASection from '@/components/CTASection';
import AIChatBubble from '@/components/AIChatBubble';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

// --- HELPER FUNCTIONS ---

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// --- SUB-COMPONENT: CAROUSEL (Samain Persis Style-nya) ---

const RoomImageCarousel = ({ images, roomName }: { images: RoomImage[] | undefined; roomName: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = images && images.length > 0 ? images : [];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `http://localhost:8000/storage/${url}`;
  };

  if (validImages.length === 0) {
    return <div className="h-64 bg-secondary animate-pulse" />;
  }

  return (
    <div className="relative h-64 overflow-hidden group/carousel">
      <img
        src={getImageUrl(validImages[currentIndex].url)}
        alt={validImages[currentIndex].alt || roomName}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {validImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute top-2 left-2 glass-strong rounded-full px-2 py-1">
            <span className="text-xs text-foreground font-medium">
              {currentIndex + 1}/{validImages.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

const HomePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setRoom, setDates } = useBooking();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const calculateNights = (startStr: string, endStr: string): number => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleBookNowClick = () => {
    document.querySelector('#booking-bar')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast({
      title: "Pilih Tanggal",
      description: "Silakan pilih tanggal untuk melihat kamar tersedia.",
    });
  };

  const handleSearch = async (checkInDate: string, checkOutDate: string, guestCount: number) => {
    if (!checkInDate || !checkOutDate) {
      toast({ title: "Data Tidak Lengkap", description: "Pilih tanggal dulu brok.", variant: "destructive" });
      return;
    }

    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
    setGuests(guestCount);

    try {
      const response = await fetch('http://localhost:8000/api/rooms/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          check_in: checkInDate,
          check_out: checkOutDate,
          guests: guestCount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAvailableRooms(data.data.available_rooms);
        setIsSearchActive(true);
        setTimeout(() => {
          document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal cek ketersediaan.", variant: "destructive" });
    }
  };

  const handleQuickBook = (room: Room) => {
    if (!checkIn || !checkOut) {
      toast({ title: "Pilih Tanggal Dulu", description: "Scroll ke atas untuk pilih tanggal.", variant: "destructive" });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const nights = calculateNights(checkIn, checkOut);
    setRoom(room);
    setDates(checkIn, checkOut, guests, nights);
    navigate('/booking/services');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNowClick={handleBookNowClick} />

      <main>
        <HeroSection />

        <div id="booking-bar">
          <BookingBar onSearch={handleSearch} />
        </div>

        <TrustBar />

        {isSearchActive && availableRooms.length > 0 ? (
          <section id="rooms" className="section-padding bg-secondary/20">
            <div className="max-w-7xl mx-auto px-4">
              {/* Header Hasil Pencarian */}
              <div className="text-center mb-16 animate-fade-up">
                <span className="inline-block px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground font-medium mb-6">
                  Akomodasi Tersedia
                </span>
                <h2 className="heading-section text-foreground mb-4">
                  Pilih Tempat Istirahat Anda
                </h2>
                <p className="body-large max-w-2xl mx-auto">
                  {availableRooms.length} kamar ditemukan untuk {guests} tamu • {new Date(checkIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(checkOut).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <button 
                  onClick={() => setIsSearchActive(false)}
                  className="mt-6 text-primary font-semibold hover:underline flex items-center gap-2 mx-auto transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali Lihat Semua Kamar
                </button>
              </div>

              {/* Grid Kamar (CARD LENGKAP) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableRooms.map((room, index) => (
                  <div
                    key={room.id}
                    className={`card-elevated overflow-hidden group animate-fade-up stagger-${(index % 3) + 1}`}
                  >
                    <div className="relative">
                      {/* 1. Carousel */}
                      <RoomImageCarousel 
                        images={room.images || (room.main_image ? [room.main_image] : [])} 
                        roomName={room.name} 
                      />

                      {/* 2. Price Tag */}
                      <div className="absolute top-4 right-4 glass-strong rounded-2xl px-4 py-2 z-10">
                        <span className="font-semibold text-foreground text-sm">
                          {formatPrice(room.total_price || room.price_per_night)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {room.nights ? `/${room.nights} malam` : '/malam'}
                        </span>
                      </div>

                      {/* 3. Stock Warning Badge */}
                      {room.available_count && room.available_count <= 5 && (
                        <div className="absolute bottom-4 left-4 glass-strong rounded-full px-3 py-1 z-10">
                          <span className="text-xs text-foreground font-medium">
                            Hanya {room.available_count} kamar tersisa!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 4. Content Area */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                          {room.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {room.description}
                        </p>
                      </div>

                      {/* 5. Amenities/Features */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                          Max {room.max_capacity} Tamu
                        </span>
                        {room.additional_features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                            {feature}
                          </span>
                        ))}
                        {room.additional_features.length > 2 && (
                          <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                            +{room.additional_features.length - 2} lainnya
                          </span>
                        )}
                      </div>

                      {/* 6. Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => { setSelectedRoom(room); setIsDetailModalOpen(true); }}
                          className="flex-1 flex items-center justify-center gap-2 btn-secondary py-3 group/btn"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => handleQuickBook(room)}
                          className="flex-1 flex items-center justify-center gap-2 btn-primary py-3 group/btn"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <RoomShowcase onQuickBook={handleQuickBook} />
        )}

        <FacilitiesSection />
        <CTASection onBookNowClick={handleBookNowClick} />
      </main>

      <Footer />
      <AIChatBubble />

      {/* Modal Detail Kamar */}
      <RoomDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        room={selectedRoom}
        onBook={handleQuickBook}
      />
    </div>
  );
};

export default HomePage;