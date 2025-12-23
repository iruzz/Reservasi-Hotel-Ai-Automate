import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import BookingBar from '@/components/BookingBar';
import RoomShowcase from '@/components/RoomShowcase';
import RoomDetailModal from '@/components/RoomDetailModal';
import FacilitiesSection from '@/components/FacilitiesSection';
import CTASection from '@/components/CTASection';
import AIChatBubble from '@/components/AIChatBubble';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

// Interface untuk Room dari API
interface Room {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_per_night: number;
  max_capacity: number;
  available_rooms: number;
  additional_features: string[];
  main_image: {
    id: number;
    url: string;
    alt: string;
    type: 'main' | 'gallery';
  } | null;
  images?: Array<{
    id: number;
    url: string;
    alt: string;
    type: 'main' | 'gallery';
    order: number;
  }>;
  // From availability check
  total_price?: number;
  available_count?: number;
  nights?: number;
}

const HomePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setRoom, setDates } = useBooking();
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Calculate nights from dates
  const calculateNights = (checkInDate: string, checkOutDate: string): number => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle Book Now dari Navbar/CTA
  const handleBookNowClick = () => {
    // Scroll to booking bar
    const bookingBar = document.querySelector('#booking-bar');
    bookingBar?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    toast({
      title: "Pilih Tanggal",
      description: "Silakan pilih tanggal check-in dan check-out untuk melihat kamar tersedia.",
    });
  };

  // Handle Search dari BookingBar
  const handleSearch = async (checkInDate: string, checkOutDate: string, guestCount: number) => {
    // Validate before sending
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Silakan pilih tanggal check-in dan check-out.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast({
        title: "Tanggal Tidak Valid",
        description: "Check-out harus setelah check-in.",
        variant: "destructive",
      });
      return;
    }

    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
    setGuests(guestCount);

    try {
      console.log('Sending request:', {
        check_in: checkInDate,
        check_out: checkOutDate,
        guests: guestCount,
      });

      const response = await fetch('http://localhost:8000/api/rooms/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          check_in: checkInDate,
          check_out: checkOutDate,
          guests: guestCount,
        }),
      });

      const data = await response.json();
      
      console.log('Response:', data);

      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages as string);
        }
        throw new Error(data.message || 'Failed to check availability');
      }

      if (data.success) {
        setAvailableRooms(data.data.available_rooms);
        setIsSearchActive(true);
        
        // Scroll ke room section
        setTimeout(() => {
          document.getElementById('rooms')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
        
        if (data.data.available_rooms.length === 0) {
          toast({
            title: "Tidak Ada Kamar Tersedia",
            description: "Maaf, tidak ada kamar tersedia untuk tanggal yang dipilih. Coba tanggal lain.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Kamar Tersedia! 🎉",
            description: `Ditemukan ${data.data.available_rooms.length} kamar untuk ${guestCount} tamu.`,
          });
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: error instanceof Error ? error.message : "Gagal mengecek ketersediaan kamar. Silakan coba lagi.",
        variant: "destructive",
      });
      setIsSearchActive(false);
    }
  };

  // Handle Quick Book dari RoomShowcase - NAVIGATE TO SERVICES PAGE
  const handleQuickBook = (room: Room) => {
    // Jika belum ada search params, minta user untuk search dulu
    if (!checkIn || !checkOut) {
      toast({
        title: "Pilih Tanggal Dulu",
        description: "Silakan pilih tanggal check-in dan check-out terlebih dahulu di atas.",
        variant: "destructive",
      });
      
      // Scroll to booking bar
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Calculate nights
    const nights = calculateNights(checkIn, checkOut);

    // Save to booking context
    setRoom(room);
    setDates(checkIn, checkOut, guests, nights);

    // Navigate to services page
    navigate('/booking/services');
  };

  const handleClearFilter = () => {
    setIsSearchActive(false);
    setAvailableRooms([]);
    setCheckIn('');
    setCheckOut('');
    setGuests(2);
    
    toast({
      title: "Filter Dihapus",
      description: "Menampilkan semua kamar.",
    });

    // Scroll to rooms
    setTimeout(() => {
      document.getElementById('rooms')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
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
        
        {/* Show search results or default room showcase */}
        {isSearchActive && availableRooms.length > 0 ? (
          <section id="rooms" className="section-padding bg-secondary/20">
            <div className="max-w-7xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="animate-fade-up">
                  <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium mb-4">
                    Hasil Pencarian
                  </span>
                  <h2 className="heading-section text-foreground mb-2">
                    Kamar Tersedia
                  </h2>
                  <p className="text-muted-foreground">
                    {availableRooms.length} kamar tersedia untuk {guests} tamu • {checkIn && checkOut ? `${new Date(checkIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${new Date(checkOut).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                  </p>
                </div>
                <button
                  onClick={handleClearFilter}
                  className="btn-secondary text-sm shrink-0 animate-fade-up"
                >
                  Lihat Semua Kamar
                </button>
              </div>
            </div>
            
            {/* Render filtered rooms manually */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableRooms.map((room, index) => (
                  <div
                    key={room.id}
                    className={`card-elevated overflow-hidden group animate-fade-up stagger-${index + 1}`}
                  >
                    {/* Room Card Content */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={
                          room.main_image?.url 
                            ? room.main_image.url.startsWith('http') 
                              ? room.main_image.url 
                              : `http://localhost:8000/storage/${room.main_image.url}`
                            : 'https://via.placeholder.com/400x300'
                        }
                        alt={room.main_image?.alt || room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300';
                        }}
                      />
                      
                      {/* Price Tag */}
                      <div className="absolute top-4 right-4 glass-strong rounded-2xl px-4 py-2">
                        <span className="font-semibold text-foreground text-sm">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(room.total_price || room.price_per_night)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {room.nights ? `/${room.nights} malam` : '/malam'}
                        </span>
                      </div>

                      {/* Stock Warning */}
                      {room.available_count && room.available_count > 0 && room.available_count <= 5 && (
                        <div className="absolute bottom-4 left-4 glass-strong rounded-full px-3 py-1">
                          <span className="text-xs text-foreground font-medium">
                            Hanya {room.available_count} kamar tersisa!
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
                        <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                          Max {room.max_capacity} Tamu
                        </span>
                        {room.additional_features.slice(0, 2).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground"
                          >
                            {feature}
                          </span>
                        ))}
                        {room.additional_features.length > 2 && (
                          <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                            +{room.additional_features.length - 2} lainnya
                          </span>
                        )}
                      </div>

                      {/* Book Button */}
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewDetails(room)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium text-[#6A6A6A] bg-[#F5F1E8] hover:bg-[#EDE9DC] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Detail</span>
                        </button>

                        {/* Quick Book Button */}
                        <button
                          onClick={() => handleQuickBook(room)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium text-white bg-[#7A8B6B] hover:bg-[#6B7A5B] transition-colors"
                        >
                          <span>Book</span>
                          <span className="transition-transform group-hover/btn:translate-x-1">→</span>
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
    </div>
  );
};

export default HomePage;