import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ExternalLink, Home, Loader2 } from 'lucide-react';

interface BookingDetail {
  booking_code: string;
  room: {
    name: string;
  };
  customer_name: string;
  customer_whatsapp: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  duration_nights: number;
  total_price: number;
  services: Array<{
    name: string;
    pivot: {
      quantity: number;
      price_snapshot: number;
    };
  }>;
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
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const BookingSuccessPage = () => {
  const { bookingCode } = useParams<{ bookingCode: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookingCode) {
      fetchBookingDetail();
    }
  }, [bookingCode]);

  const fetchBookingDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingCode}`);
      const data = await response.json();
      
      if (data.success) {
        setBooking(data.data.booking);
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    if (!booking) return;

    let message = 
      `Halo, saya telah melakukan booking dengan detail:\n\n` +
      `🔖 Kode Booking: ${booking.booking_code}\n` +
      `👤 Nama: ${booking.customer_name}\n` +
      `🏨 Kamar: ${booking.room.name}\n` +
      `📅 Check-in: ${formatDate(booking.check_in)}\n` +
      `📅 Check-out: ${formatDate(booking.check_out)}\n` +
      `🌙 Durasi: ${booking.duration_nights} malam\n` +
      `👥 Tamu: ${booking.guest_count} orang\n`;

    if (booking.services.length > 0) {
      message += `\n✨ Layanan Tambahan:\n`;
      booking.services.forEach(service => {
        message += `   • ${service.name}`;
        if (service.pivot.quantity > 1) {
          message += ` (×${service.pivot.quantity})`;
        }
        message += `\n`;
      });
    }

    message += 
      `\n💵 Total: ${formatPrice(booking.total_price)}\n\n` +
      `Mohon konfirmasi booking saya dan berikan instruksi pembayaran. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6285331132617?text=${encodedMessage}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#7A8B6B] animate-spin mx-auto mb-4" />
          <p className="text-[#6A6A6A]">Memuat detail booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8A8A8A] mb-4">Booking tidak ditemukan</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-2xl font-semibold text-white bg-[#7A8B6B] hover:bg-[#6B7A5B] transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#7A8B6B]/10 mb-4">
            <CheckCircle2 className="w-12 h-12 text-[#7A8B6B]" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#3A3A3A] mb-2">
            Booking Berhasil!
          </h1>
          <p className="text-[#6A6A6A]">
            Terima kasih telah melakukan reservasi di Asmaralaya Escape
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white border border-[#E5E1D8] rounded-2xl p-6 md:p-8 mb-6">
          <div className="mb-6 pb-6 border-b border-[#E5E1D8]">
            <p className="text-sm text-[#8A8A8A] mb-2">Kode Booking</p>
            <p className="font-mono text-2xl font-bold text-[#7A8B6B]">
              {booking.booking_code}
            </p>
            <p className="text-xs text-[#8A8A8A] mt-2">
              Simpan kode ini untuk referensi booking Anda
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#8A8A8A] mb-1">Kamar</p>
              <p className="font-semibold text-[#3A3A3A]">{booking.room.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#8A8A8A] mb-1">Check-in</p>
                <p className="font-medium text-[#3A3A3A]">
                  {formatDate(booking.check_in)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#8A8A8A] mb-1">Check-out</p>
                <p className="font-medium text-[#3A3A3A]">
                  {formatDate(booking.check_out)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#8A8A8A] mb-1">Durasi</p>
                <p className="font-medium text-[#3A3A3A]">
                  {booking.duration_nights} malam
                </p>
              </div>
              <div>
                <p className="text-sm text-[#8A8A8A] mb-1">Tamu</p>
                <p className="font-medium text-[#3A3A3A]">
                  {booking.guest_count} orang
                </p>
              </div>
            </div>

            {booking.services.length > 0 && (
              <div className="pt-4 border-t border-[#E5E1D8]">
                <p className="text-sm text-[#8A8A8A] mb-2">Layanan Tambahan</p>
                <ul className="space-y-1">
                  {booking.services.map((service, idx) => (
                    <li key={idx} className="text-[#3A3A3A]">
                      • {service.name}
                      {service.pivot.quantity > 1 && ` (×${service.pivot.quantity})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-[#E5E1D8]">
              <div className="flex justify-between items-center">
                <span className="text-[#6A6A6A]">Total Pembayaran</span>
                <span className="font-serif text-2xl font-semibold text-[#7A8B6B]">
                  {formatPrice(booking.total_price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#FFF5E6] border border-[#F0D9B8] rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-[#8B6914] mb-3">
            📱 Langkah Selanjutnya
          </h3>
          <ol className="text-sm text-[#8B6914] space-y-2">
            <li>1. Klik tombol "Hubungi via WhatsApp" di bawah</li>
            <li>2. Konfirmasi booking Anda dengan tim kami</li>
            <li>3. Lakukan pembayaran sesuai instruksi yang diberikan</li>
            <li>4. Simpan bukti pembayaran untuk ditunjukkan saat check-in</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleWhatsAppContact}
            className="w-full px-8 py-4 rounded-2xl font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Hubungi via WhatsApp</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full px-8 py-4 rounded-2xl font-semibold text-[#6A6A6A] bg-[#F5F1E8] hover:bg-[#EDE9DC] transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        <p className="text-xs text-center text-[#8A8A8A] mt-6">
          Konfirmasi booking juga telah dikirim ke email: {booking.customer_whatsapp}
        </p>
      </div>
    </div>
  );
};

export default BookingSuccessPage;