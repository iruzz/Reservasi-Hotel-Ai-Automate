import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Plus, Minus, ChevronRight } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const BookingServicesPage = () => {
  const navigate = useNavigate();
  const { bookingData, setServices, calculateTotal } = useBooking();
  
  const [services, setServicesData] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    bookingData.selectedServices
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if no room selected
    if (!bookingData.room) {
      navigate('/');
      return;
    }

    fetchServices();
  }, [bookingData.room, navigate]);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/services');
      const data = await response.json();
      
      if (data.success) {
        setServicesData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleService = (service: Service) => {
    const existing = selectedServices.find(s => s.service.id === service.id);
    
    if (existing) {
      setSelectedServices(prev => prev.filter(s => s.service.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, { service, quantity: 1 }]);
    }
  };

  const updateQuantity = (serviceId: number, delta: number) => {
    setSelectedServices(prev => 
      prev.map(item => {
        if (item.service.id === serviceId) {
          const newQuantity = item.quantity + delta;
          
          if (newQuantity < 1) return item;
          if (item.service.max_quantity && newQuantity > item.service.max_quantity) {
            return item;
          }
          
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleSkip = () => {
    setServices([]);
    navigate('/booking/checkout');
  };

  const handleContinue = () => {
    setServices(selectedServices);
    navigate('/booking/checkout');
  };

  const total = calculateTotal();
  const servicesTotal = selectedServices.reduce(
    (sum, item) => sum + (item.service.price * item.quantity),
    0
  );

  if (!bookingData.room) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E1D8] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#6A6A6A] hover:text-[#3A3A3A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#3A3A3A] mb-2">
            Tingkatkan Pengalaman Menginap
          </h1>
          <p className="text-[#6A6A6A]">
            Pilih layanan tambahan untuk membuat menginap Anda lebih berkesan (opsional)
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white border border-[#E5E1D8] rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
              <img
                src={bookingData.room.main_image?.url || '/placeholder.jpg'}
                alt={bookingData.room.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-[#3A3A3A] text-lg mb-2">
                {bookingData.room.name}
              </h3>
              <div className="text-sm text-[#6A6A6A] space-y-1">
                <p>
                  {formatDate(bookingData.checkIn)} → {formatDate(bookingData.checkOut)}
                </p>
                <p>{bookingData.nights} malam · {bookingData.guests} tamu</p>
                <p className="font-semibold text-[#7A8B6B]">
                  {formatPrice(total.roomTotal)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-[#8A8A8A]">
            Memuat layanan...
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-[#8A8A8A]">
            Tidak ada layanan tersedia
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {services.map(service => {
              const selected = selectedServices.find(s => s.service.id === service.id);
              const isSelected = !!selected;

              return (
                <div
                  key={service.id}
                  className={`bg-white border-2 rounded-2xl p-6 transition-all ${
                    isSelected 
                      ? 'border-[#7A8B6B] bg-[#F5F1E8]/30' 
                      : 'border-[#E5E1D8] hover:border-[#C9C5BC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-[#3A3A3A] text-lg mb-1">
                            {service.name}
                          </h4>
                          <p className="text-sm text-[#6A6A6A]">
                            {service.description}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleService(service)}
                          className={`ml-4 w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? 'border-[#7A8B6B] bg-[#7A8B6B]'
                              : 'border-[#C9C5BC] hover:border-[#7A8B6B]'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-[#7A8B6B]">
                          {service.formatted_price}
                        </span>

                        {isSelected && service.has_quantity && (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(service.id, -1)}
                              disabled={selected.quantity <= 1}
                              className="w-9 h-9 rounded-lg bg-[#F5F1E8] hover:bg-[#EDE9DC] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-4 h-4 text-[#5A5A5A]" />
                            </button>
                            <span className="w-10 text-center font-semibold text-[#3A3A3A]">
                              {selected.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(service.id, 1)}
                              disabled={service.max_quantity ? selected.quantity >= service.max_quantity : false}
                              className="w-9 h-9 rounded-lg bg-[#F5F1E8] hover:bg-[#EDE9DC] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-4 h-4 text-[#5A5A5A]" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary & Action Buttons */}
        <div className="bg-white border border-[#E5E1D8] rounded-2xl p-6 sticky bottom-4">
          {selectedServices.length > 0 && (
            <div className="mb-4 pb-4 border-b border-[#E5E1D8]">
              <p className="text-sm text-[#8A8A8A] mb-2">Layanan yang dipilih:</p>
              <div className="space-y-2">
                {selectedServices.map(item => (
                  <div key={item.service.id} className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">
                      {item.service.name}
                      {item.quantity > 1 && ` (×${item.quantity})`}
                    </span>
                    <span className="font-semibold text-[#3A3A3A]">
                      {formatPrice(item.service.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-[#E5E1D8]">
                <span className="font-semibold text-[#3A3A3A]">Total Layanan</span>
                <span className="font-semibold text-[#7A8B6B]">
                  {formatPrice(servicesTotal)}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-4 rounded-2xl font-semibold text-[#6A6A6A] bg-[#F5F1E8] hover:bg-[#EDE9DC] transition-colors"
            >
              Lewati
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 px-6 py-4 rounded-2xl font-semibold text-white bg-[#7A8B6B] hover:bg-[#6B7A5B] transition-colors flex items-center justify-center gap-2"
            >
              <span>
                {selectedServices.length > 0 
                  ? `Lanjut dengan ${selectedServices.length} layanan` 
                  : 'Lanjut ke Checkout'
                }
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingServicesPage;