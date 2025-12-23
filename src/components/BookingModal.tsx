import { useState, useEffect } from 'react';
import { X, Calendar, Users, MapPin, ExternalLink, Plus, Minus } from 'lucide-react';

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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
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
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getImageUrl = (url: string | undefined) => {
  if (!url) return '';
  
  if (url.startsWith('http')) {
    return url;
  }
  
  if (url.startsWith('/storage/')) {
    return `http://localhost:8000${url}`;
  }
  
  return `http://localhost:8000/storage/${url}`;
};

const BookingModal = ({
  isOpen,
  onClose,
  room,
  checkIn,
  checkOut,
  guests,
  nights,
  totalPrice,
}: BookingModalProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [showServices, setShowServices] = useState(false);

  // Fetch services dari API
  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    setIsLoadingServices(true);
    try {
      const response = await fetch('http://localhost:8000/api/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Toggle service selection
  const toggleService = (service: Service) => {
    const existing = selectedServices.find(s => s.service.id === service.id);
    
    if (existing) {
      // Remove service
      setSelectedServices(prev => prev.filter(s => s.service.id !== service.id));
    } else {
      // Add service with default quantity
      setSelectedServices(prev => [...prev, { service, quantity: 1 }]);
    }
  };

  // Update quantity
  const updateQuantity = (serviceId: number, delta: number) => {
    setSelectedServices(prev => 
      prev.map(item => {
        if (item.service.id === serviceId) {
          const newQuantity = item.quantity + delta;
          
          // Validate quantity
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

  // Calculate totals
  const roomSubtotal = totalPrice;
  const servicesTotal = selectedServices.reduce(
    (sum, item) => sum + (item.service.price * item.quantity),
    0
  );
  const subtotal = roomSubtotal + servicesTotal;
  const serviceFee = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + serviceFee;

  const handleWhatsAppBooking = () => {
    let message = 
      `Halo, saya ingin melakukan reservasi:\n\n` +
      `🏨 Kamar: ${room?.name}\n` +
      `📅 Check-in: ${formatDate(checkIn)}\n` +
      `📅 Check-out: ${formatDate(checkOut)}\n` +
      `🌙 Durasi: ${nights} malam\n` +
      `👥 Tamu: ${guests} orang\n` +
      `💰 Harga Kamar: ${formatPrice(roomSubtotal)}\n`;

    // Add selected services to message
    if (selectedServices.length > 0) {
      message += `\n✨ Layanan Tambahan:\n`;
      selectedServices.forEach(item => {
        const itemTotal = item.service.price * item.quantity;
        message += `   • ${item.service.name}`;
        if (item.quantity > 1) {
          message += ` (x${item.quantity})`;
        }
        message += `: ${formatPrice(itemTotal)}\n`;
      });
    }

    message += 
      `\n💵 Total: ${formatPrice(grandTotal)}\n\n` +
      `Mohon konfirmasi ketersediaan. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6285331132617?text=${encodedMessage}`, '_blank');
  };

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal - Made scrollable */}
      <div className="relative w-full max-w-lg glass-strong rounded-[2rem] shadow-elevated animate-slide-up overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="relative p-6 pb-4 border-b border-border/50 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center
                     hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="font-serif text-2xl font-semibold text-foreground pr-12">
            Konfirmasi Booking
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Periksa detail reservasi Anda
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {/* Room Info */}
            <div className="flex gap-4 p-4 bg-secondary/50 rounded-2xl">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img
                  src={getImageUrl(room.main_image?.url)}
                  alt={room.main_image?.alt || room.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/80';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-foreground">
                  {room.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  Asmaralaya Escape, Ubud
                </p>
                {room.available_rooms > 0 && room.available_rooms <= 5 && (
                  <p className="text-xs text-orange-500 mt-1">
                    ⚠️ Hanya {room.available_rooms} kamar tersisa
                  </p>
                )}
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Check-in</span>
                </div>
                <span className="font-medium text-foreground">{formatDate(checkIn)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Check-out</span>
                </div>
                <span className="font-medium text-foreground">{formatDate(checkOut)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Tamu</span>
                </div>
                <span className="font-medium text-foreground">{guests} orang</span>
              </div>
            </div>

            {/* Additional Services Section */}
            <div className="border-t border-border/50 pt-6">
              <button
                onClick={() => setShowServices(!showServices)}
                className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 
                         rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">Tambah Layanan</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedServices.length > 0 
                        ? `${selectedServices.length} layanan dipilih`
                        : 'Tingkatkan pengalaman Anda'
                      }
                    </p>
                  </div>
                </div>
                <div className={`transition-transform ${showServices ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Services List - Collapsible */}
              {showServices && (
                <div className="mt-4 space-y-3">
                  {isLoadingServices ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Memuat layanan...
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Tidak ada layanan tersedia
                    </div>
                  ) : (
                    services.map(service => {
                      const selected = selectedServices.find(s => s.service.id === service.id);
                      const isSelected = !!selected;

                      return (
                        <div
                          key={service.id}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border/50 bg-secondary/20 hover:border-border'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground text-sm">
                                    {service.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {service.description}
                                  </p>
                                </div>
                                <button
                                  onClick={() => toggleService(service)}
                                  className={`ml-2 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0
                                           transition-colors ${
                                    isSelected
                                      ? 'border-primary bg-primary'
                                      : 'border-border/50 hover:border-primary'
                                  }`}
                                >
                                  {isSelected && (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </button>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <span className="text-sm font-semibold text-primary">
                                  {service.formatted_price}
                                </span>

                                {/* Quantity Controls */}
                                {isSelected && service.has_quantity && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateQuantity(service.id, -1)}
                                      disabled={selected.quantity <= 1}
                                      className="w-7 h-7 rounded-lg bg-secondary hover:bg-muted flex items-center justify-center
                                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-foreground">
                                      {selected.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(service.id, 1)}
                                      disabled={service.max_quantity ? selected.quantity >= service.max_quantity : false}
                                      className="w-7 h-7 rounded-lg bg-secondary hover:bg-muted flex items-center justify-center
                                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-secondary/30 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatPrice(room.price_per_night)} × {nights} malam
                </span>
                <span className="text-foreground">{formatPrice(roomSubtotal)}</span>
              </div>

              {/* Show selected services in breakdown */}
              {selectedServices.length > 0 && (
                <div className="space-y-2 py-2 border-t border-border/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Layanan Tambahan</p>
                  {selectedServices.map(item => (
                    <div key={item.service.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.service.name}
                        {item.quantity > 1 && ` (×${item.quantity})`}
                      </span>
                      <span className="text-foreground">
                        {formatPrice(item.service.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between text-sm pt-2 border-t border-border/30">
                <span className="text-muted-foreground">Biaya layanan (10%)</span>
                <span className="text-foreground">{formatPrice(serviceFee)}</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-serif text-xl font-semibold text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 pt-0 border-t border-border/50 shrink-0">
          <button
            onClick={handleWhatsAppBooking}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
          >
            <span>Lanjutkan ke WhatsApp</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;