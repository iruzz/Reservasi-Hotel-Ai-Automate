import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Check, Loader2 } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

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

const BookingCheckoutPage = () => {
  const navigate = useNavigate();
  const { bookingData, setCustomerInfo, calculateTotal, clearBooking } = useBooking();
  
  const [customerName, setCustomerName] = useState(bookingData.customerName);
  const [customerEmail, setCustomerEmail] = useState(bookingData.customerEmail);
  const [customerWhatsapp, setCustomerWhatsapp] = useState(bookingData.customerWhatsapp);
  const [specialRequests, setSpecialRequests] = useState(bookingData.specialRequests);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!bookingData.room) {
      navigate('/');
    }
  }, [bookingData.room, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!customerEmail.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!customerWhatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    } else if (!/^[0-9]{10,15}$/.test(customerWhatsapp.replace(/[\s-]/g, ''))) {
      newErrors.whatsapp = 'Nomor WhatsApp tidak valid (10-15 digit)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Save customer info to context
    setCustomerInfo(customerName, customerEmail, customerWhatsapp, specialRequests);

    try {
      // Prepare booking data for API
      const bookingPayload = {
        room_id: bookingData.room?.id,
        customer_name: customerName,
        customer_whatsapp: customerWhatsapp,
        customer_email: customerEmail,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guest_count: bookingData.guests,
        special_requests: specialRequests || null,
        services: bookingData.selectedServices.map(item => ({
          service_id: item.service.id,
          quantity: item.quantity,
          notes: null,
        })),
      };

      const response = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (data.success) {
        // Booking berhasil dibuat
        const bookingCode = data.data.booking.booking_code;
        
        // Redirect ke success page atau WhatsApp
        navigate(`/booking/success/${bookingCode}`);
        
        // Clear booking context
        clearBooking();
      } else {
        alert(data.message || 'Terjadi kesalahan saat membuat booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Terjadi kesalahan saat membuat booking. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData.room) {
    return null;
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E1D8] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#6A6A6A] hover:text-[#3A3A3A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#3A3A3A] mb-8">
              Konfirmasi & Pembayaran
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white border border-[#E5E1D8] rounded-2xl p-6">
                <h2 className="font-semibold text-[#3A3A3A] text-lg mb-4">
                  Data Pemesan
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5A5A5A] mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[#E5E1D8] focus:border-[#7A8B6B]'
                      } focus:outline-none transition-colors`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5A5A5A] mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[#E5E1D8] focus:border-[#7A8B6B]'
                      } focus:outline-none transition-colors`}
                      placeholder="nama@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5A5A5A] mb-2">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.whatsapp 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[#E5E1D8] focus:border-[#7A8B6B]'
                      } focus:outline-none transition-colors`}
                      placeholder="08123456789"
                    />
                    {errors.whatsapp && (
                      <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
                    )}
                    <p className="text-xs text-[#8A8A8A] mt-1">
                      Gunakan nomor WhatsApp aktif untuk konfirmasi booking
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5A5A5A] mb-2">
                      Permintaan Khusus (Opsional)
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E1D8] focus:border-[#7A8B6B] focus:outline-none transition-colors resize-none"
                      placeholder="Contoh: Early check-in, high floor, dll"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="bg-[#FFF5E6] border border-[#F0D9B8] rounded-2xl p-6">
                <h3 className="font-semibold text-[#8B6914] mb-2">
                  📱 Pembayaran via WhatsApp
                </h3>
                <p className="text-sm text-[#8B6914]">
                  Setelah konfirmasi, Anda akan diarahkan ke WhatsApp untuk melanjutkan pembayaran 
                  dan mendapatkan instruksi lebih lanjut dari tim kami.
                </p>
              </div>

              {/* Submit Button - Mobile */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-2xl font-semibold text-white bg-[#7A8B6B] hover:bg-[#6B7A5B] disabled:bg-[#C9C5BC] transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Konfirmasi Booking</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Room Summary */}
              <div className="bg-white border border-[#E5E1D8] rounded-2xl p-6">
                <h3 className="font-semibold text-[#3A3A3A] mb-4">
                  Ringkasan Pesanan
                </h3>

                {/* Room Info */}
                <div className="flex gap-4 mb-4 pb-4 border-b border-[#E5E1D8]">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={bookingData.room.main_image?.url || '/placeholder.jpg'}
                      alt={bookingData.room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-[#3A3A3A] mb-1">
                      {bookingData.room.name}
                    </h4>
                    <p className="text-sm text-[#6A6A6A] flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Asmaralaya Escape, Ubud
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3 mb-4 pb-4 border-b border-[#E5E1D8]">
                  <div className="flex items-center gap-3 text-sm text-[#6A6A6A]">
                    <Calendar className="w-4 h-4" />
                    <div className="flex-1">
                      <span>Check-in</span>
                      <p className="font-semibold text-[#3A3A3A]">
                        {formatDate(bookingData.checkIn)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#6A6A6A]">
                    <Calendar className="w-4 h-4" />
                    <div className="flex-1">
                      <span>Check-out</span>
                      <p className="font-semibold text-[#3A3A3A]">
                        {formatDate(bookingData.checkOut)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#6A6A6A]">
                    <Users className="w-4 h-4" />
                    <span>{bookingData.guests} tamu · {bookingData.nights} malam</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6A6A6A]">
                      {formatPrice(bookingData.room.price_per_night)} × {bookingData.nights} malam
                    </span>
                    <span className="text-[#3A3A3A]">
                      {formatPrice(total.roomTotal)}
                    </span>
                  </div>

                  {bookingData.selectedServices.length > 0 && (
                    <div className="pt-3 border-t border-[#E5E1D8]">
                      <p className="text-xs font-semibold text-[#8A8A8A] mb-2 uppercase">
                        Layanan Tambahan
                      </p>
                      {bookingData.selectedServices.map(item => (
                        <div key={item.service.id} className="flex justify-between text-sm mb-2">
                          <span className="text-[#6A6A6A]">
                            {item.service.name}
                            {item.quantity > 1 && ` (×${item.quantity})`}
                          </span>
                          <span className="text-[#3A3A3A]">
                            {formatPrice(item.service.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between text-sm pt-3 border-t border-[#E5E1D8]">
                    <span className="text-[#6A6A6A]">Biaya layanan (10%)</span>
                    <span className="text-[#3A3A3A]">
                      {formatPrice(total.serviceFee)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t-2 border-[#E5E1D8]">
                    <span className="font-semibold text-[#3A3A3A]">Total</span>
                    <span className="font-serif text-2xl font-semibold text-[#7A8B6B]">
                      {formatPrice(total.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button - Desktop */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-2xl font-semibold text-white bg-[#7A8B6B] hover:bg-[#6B7A5B] disabled:bg-[#C9C5BC] transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Konfirmasi Booking</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-center text-[#8A8A8A]">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckoutPage;