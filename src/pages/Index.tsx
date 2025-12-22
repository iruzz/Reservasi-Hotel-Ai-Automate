import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import BookingBar from '@/components/BookingBar';
import RoomShowcase, { type Room } from '@/components/RoomShowcase';
import FacilitiesSection from '@/components/FacilitiesSection';
import AIChatBubble from '@/components/AIChatBubble';
import BookingModal from '@/components/BookingModal';
import Footer from '@/components/Footer';

// Default room for when none is selected
import roomSuite from '@/assets/room-suite.jpg';

const defaultRoom: Room = {
  id: 'suite',
  name: 'Pool Suite',
  description: 'Suite mewah dengan akses kolam renang privat.',
  price: 2800000,
  image: roomSuite,
  features: ['65 m²', 'Private Pool', 'Living Area'],
};

const Index = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleBookNowClick = () => {
    setSelectedRoom(defaultRoom);
    setIsBookingModalOpen(true);
  };

  const handleSearch = (checkInDate: string, checkOutDate: string, guestCount: number) => {
    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
    setGuests(guestCount);
    setSelectedRoom(defaultRoom);
    setIsBookingModalOpen(true);
  };

  const handleQuickBook = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNowClick={handleBookNowClick} />
      
      <main>
        <HeroSection />
        <BookingBar onSearch={handleSearch} />
        <TrustBar />
        <RoomShowcase onQuickBook={handleQuickBook} />
        <FacilitiesSection />
      </main>

      <Footer />
      
      <AIChatBubble />
      
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        room={selectedRoom}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
      />
    </div>
  );
};

export default Index;
