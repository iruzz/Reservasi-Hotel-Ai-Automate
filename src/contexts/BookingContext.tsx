import { createContext, useContext, useState, ReactNode } from 'react';

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

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  formatted_price: string;
  category: string;
  image_url: string | null;
  has_quantity: boolean;
  max_quantity: number | null;
}

interface SelectedService {
  service: Service;
  quantity: number;
}

interface BookingData {
  // Room & Date Info
  room: Room | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  
  // Selected Services
  selectedServices: SelectedService[];
  
  // Customer Info (filled in checkout)
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  specialRequests: string;
}

interface BookingContextType {
  bookingData: BookingData;
  setRoom: (room: Room) => void;
  setDates: (checkIn: string, checkOut: string, guests: number, nights: number) => void;
  setServices: (services: SelectedService[]) => void;
  setCustomerInfo: (name: string, email: string, whatsapp: string, requests: string) => void;
  clearBooking: () => void;
  calculateTotal: () => {
    roomTotal: number;
    servicesTotal: number;
    subtotal: number;
    serviceFee: number;
    grandTotal: number;
  };
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialBookingData: BookingData = {
  room: null,
  checkIn: '',
  checkOut: '',
  guests: 2,
  nights: 1,
  selectedServices: [],
  customerName: '',
  customerEmail: '',
  customerWhatsapp: '',
  specialRequests: '',
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);

  const setRoom = (room: Room) => {
    setBookingData(prev => ({ ...prev, room }));
  };

  const setDates = (checkIn: string, checkOut: string, guests: number, nights: number) => {
    setBookingData(prev => ({ ...prev, checkIn, checkOut, guests, nights }));
  };

  const setServices = (services: SelectedService[]) => {
    setBookingData(prev => ({ ...prev, selectedServices: services }));
  };

  const setCustomerInfo = (name: string, email: string, whatsapp: string, requests: string) => {
    setBookingData(prev => ({
      ...prev,
      customerName: name,
      customerEmail: email,
      customerWhatsapp: whatsapp,
      specialRequests: requests,
    }));
  };

  const clearBooking = () => {
    setBookingData(initialBookingData);
  };

  const calculateTotal = () => {
    if (!bookingData.room) {
      return {
        roomTotal: 0,
        servicesTotal: 0,
        subtotal: 0,
        serviceFee: 0,
        grandTotal: 0,
      };
    }

    const roomTotal = bookingData.room.price_per_night * bookingData.nights;
    const servicesTotal = bookingData.selectedServices.reduce(
      (sum, item) => sum + (item.service.price * item.quantity),
      0
    );
    const subtotal = roomTotal + servicesTotal;
    const serviceFee = Math.round(subtotal * 0.1);
    const grandTotal = subtotal + serviceFee;

    return {
      roomTotal,
      servicesTotal,
      subtotal,
      serviceFee,
      grandTotal,
    };
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setRoom,
        setDates,
        setServices,
        setCustomerInfo,
        clearBooking,
        calculateTotal,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};