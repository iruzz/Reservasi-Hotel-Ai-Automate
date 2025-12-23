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

// Perbaikan Interface agar lebih konsisten
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
    url: string;
    alt: string;
  } | null;
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
  
  // State untuk Modal Detail
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateNights = (startStr: string, endStr: string): number => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const handleBookNowClick = () => {
    document.querySelector('#booking-bar')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast({
      title: "Pilih Tanggal",
      description: "Silakan pilih tanggal untuk mengecek ketersediaan.",
    });
  };

  const handleSearch = async (checkInDate: string, checkOutDate: string, guestCount: number) => {
    if (!checkInDate || !checkOutDate) {
      toast({ title: "Data Tidak Lengkap", description: "Pilih tanggal check-in & check-out.", variant: "destructive" });
      return;
    }

    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
    setGuests(guestCount);

    try {
      const response = await fetch('http://localhost:8000/api/rooms/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ check_in: checkInDate, check_out: checkOutDate, guests: guestCount }),
      });

      const data = await response.json();

      if (data.success) {
        setAvailableRooms(data.data.available_rooms);
        setIsSearchActive(true);
        setTimeout(() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat data kamar.", variant: "destructive" });
    }
  };

  const handleQuickBook = (room: Room) => {
    if (!checkIn || !checkOut) {
      toast({ title: "Pilih Tanggal", description: "Tentukan tanggal menginap terlebih dahulu.", variant: "destructive" });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const nights = calculateNights(checkIn, checkOut);
    setRoom(room);
    setDates(checkIn, checkOut, guests, nights);
    navigate('/booking/services');
  };

  // Fungsi View Details yang sebelumnya hilang
  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleClearFilter = () => {
    setIsSearchActive(false);
    setAvailableRooms([]);
    setCheckIn('');
    setCheckOut('');
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
        
        {isSearchActive ? (
          <section id="rooms" className="section-padding bg-secondary/20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-serif font-bold">Kamar Tersedia</h2>
                  <p className="text-muted-foreground mt-2">
                    {availableRooms.length} opsi ditemukan untuk perjalanan Anda.
                  </p>
                </div>
                <button onClick={handleClearFilter} className="text-primary font-medium hover:underline">
                  Lihat Semua Kamar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableRooms.map((room) => (
                  <RoomCard 
                    key={room.id} 
                    room={room} 
                    onViewDetail={() => handleViewDetails(room)} 
                    onBook={() => handleQuickBook(room)} 
                  />
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
      {selectedRoom && (
        <RoomDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          room={selectedRoom}
          onBook={() => handleQuickBook(selectedRoom)}
        />
      )}
    </div>
  );
};

// Komponen Card Kecil untuk kebersihan kode
const RoomCard = ({ room, onViewDetail, onBook }: { room: Room, onViewDetail: () => void, onBook: () => void }) => {
  const imageUrl = room.main_image?.url.startsWith('http') 
    ? room.main_image.url 
    : `http://localhost:8000/storage/${room.main_image?.url}`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
      <div className="relative h-64">
        <img src={imageUrl} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
          <span className="font-bold text-primary">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(room.total_price || room.price_per_night)}
          </span>
          <span className="text-xs text-muted-foreground">/{room.nights || 1}malam</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{room.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{room.description}</p>
        <div className="flex gap-2">
          <button onClick={onViewDetail} className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors">Detail</button>
          <button onClick={onBook} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;