import { X, Calendar, Users, MapPin, ExternalLink } from 'lucide-react';
import type { Room } from './RoomShowcase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
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

const calculateNights = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

const BookingModal = ({
  isOpen,
  onClose,
  room,
  checkIn,
  checkOut,
  guests,
}: BookingModalProps) => {
  if (!isOpen) return null;

  const nights = calculateNights(checkIn, checkOut);
  const roomPrice = room?.price || 2800000;
  const subtotal = roomPrice * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const handleWhatsAppBooking = () => {
    const message = encodeURIComponent(
      `Halo, saya ingin melakukan reservasi:\n\n` +
      `🏨 Kamar: ${room?.name || 'Pool Suite'}\n` +
      `📅 Check-in: ${formatDate(checkIn)}\n` +
      `📅 Check-out: ${formatDate(checkOut)}\n` +
      `👥 Tamu: ${guests} orang\n` +
      `💰 Total: ${formatPrice(total)}\n\n` +
      `Mohon konfirmasi ketersediaan. Terima kasih!`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-strong rounded-[2rem] shadow-elevated animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-border/50">
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Room Info */}
          <div className="flex gap-4 p-4 bg-secondary/50 rounded-2xl">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <img
                src={room?.image}
                alt={room?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-foreground">
                {room?.name || 'Pool Suite'}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                Asmaralaya Escape, Ubud
              </p>
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

          {/* Price Breakdown */}
          <div className="bg-secondary/30 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatPrice(roomPrice)} × {nights} malam
              </span>
              <span className="text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Biaya layanan (10%)</span>
              <span className="text-foreground">{formatPrice(serviceFee)}</span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-serif text-xl font-semibold text-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={handleWhatsAppBooking}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
          >
            <span>Continue to WhatsApp Payment</span>
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
