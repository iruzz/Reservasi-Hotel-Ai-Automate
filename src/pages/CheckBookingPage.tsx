import { useState } from 'react';
import { Search, ArrowLeft, Calendar, Users, Bed, ChevronRight, X } from 'lucide-react';

interface BookingDetails {
  booking_code: string;
  room_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  services?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  created_at: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: {
      label: 'Menunggu Pembayaran',
      className: 'bg-yellow-100 text-yellow-800',
    },
    confirmed: {
      label: 'Dikonfirmasi',
      className: 'bg-green-100 text-green-800',
    },
    cancelled: {
      label: 'Dibatalkan',
      className: 'bg-red-100 text-red-800',
    },
    completed: {
      label: 'Selesai',
      className: 'bg-blue-100 text-blue-800',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

const CheckBookingPage = () => {
  const [bookingCode, setBookingCode] = useState('');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!bookingCode.trim()) {
      setError('Silakan masukkan kode booking');
      return;
    }

    setIsLoading(true);
    setError('');
    setBookingDetails(null);

    try {
      // Updated endpoint - menggunakan /check/{bookingCode}
      const response = await fetch(`https://apireservasihotel.42web.io/api//bookings/check/${bookingCode}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking tidak ditemukan');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setBookingDetails(data.data);
      } else {
        throw new Error(data.message || 'Booking tidak ditemukan');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.');
      setBookingDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBookingCode('');
    setBookingDetails(null);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h1 className="heading-section mb-4">Cek Status Booking</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Masukkan kode booking Anda untuk melihat detail dan status reservasi
            </p>
          </div>

          {/* Search Form */}
          <div className="card-elevated p-8 mb-8 animate-fade-up stagger-1">
            <div className="space-y-6">
              <div>
                <label htmlFor="bookingCode" className="block text-sm font-medium text-foreground mb-2">
                  Kode Booking
                </label>
                <div className="relative">
                  <input
                    id="bookingCode"
                    type="text"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    placeholder="Contoh: BK20250101-XXXXX"
                    className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-secondary focus:border-primary focus:ring-0 transition-colors bg-background text-foreground placeholder:text-muted-foreground"
                    disabled={isLoading}
                  />
                  {bookingCode && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Kode booking dapat ditemukan di email konfirmasi Anda
                </p>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                  <p className="text-xs text-destructive/80 mt-1">
                    Pastikan kode booking yang Anda masukkan benar.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleSearch}
                disabled={isLoading || !bookingCode.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Cari Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Booking Details */}
          {bookingDetails && (
            <div className="space-y-6 animate-fade-up stagger-2">
              {/* Status Card */}
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Kode Booking</p>
                    <p className="text-2xl font-serif font-semibold text-foreground">
                      {bookingDetails.booking_code}
                    </p>
                  </div>
                  {getStatusBadge(bookingDetails.status)}
                </div>
                
                <div className="pt-4 border-t border-secondary">
                  <p className="text-sm text-muted-foreground">
                    Dibuat pada {formatDate(bookingDetails.created_at)}
                  </p>
                </div>
              </div>

              {/* Room Details */}
              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Detail Kamar</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Bed className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{bookingDetails.room_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingDetails.nights} malam
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(bookingDetails.check_in)} - {formatDate(bookingDetails.check_out)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Check-in 14:00 • Check-out 12:00
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {bookingDetails.guests} Tamu
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Informasi Tamu</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nama</p>
                    <p className="text-foreground font-medium">{bookingDetails.guest_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium">{bookingDetails.guest_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telepon</p>
                    <p className="text-foreground font-medium">{bookingDetails.guest_phone}</p>
                  </div>
                </div>
              </div>

              {/* Services (if any) */}
              {bookingDetails.services && bookingDetails.services.length > 0 && (
                <div className="card-elevated p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Layanan Tambahan</h3>
                  <div className="space-y-3">
                    {bookingDetails.services.map((service, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="text-foreground font-medium">{service.name}</p>
                          {service.quantity > 1 && (
                            <p className="text-sm text-muted-foreground">× {service.quantity}</p>
                          )}
                        </div>
                        <p className="text-foreground font-semibold">
                          {formatPrice(service.price * service.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Amount */}
              <div className="card-elevated p-6 bg-primary/5 border-2 border-primary/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
                    <p className="text-3xl font-serif font-semibold text-primary">
                      {formatPrice(bookingDetails.total_amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleReset}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari Booking Lain</span>
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <span>Booking Baru</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!bookingDetails && !error && !isLoading && bookingCode === '' && (
            <div className="text-center py-12 animate-fade-up stagger-2">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-full mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-6">
                Belum ada pencarian. Masukkan kode booking Anda di atas.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-ghost inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckBookingPage;