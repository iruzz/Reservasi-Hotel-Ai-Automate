import { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';

interface BookingBarProps {
  onSearch: (checkIn: string, checkOut: string, guests: number) => void;
}

const BookingBar = ({ onSearch }: BookingBarProps) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const handleSearch = () => {
    onSearch(checkIn, checkOut, guests);
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="relative z-20 -mt-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="glass-strong rounded-[2rem] p-4 md:p-6 shadow-elevated">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Check-in */}
            <div className="relative">
              <label className="block text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="relative">
              <label className="block text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Check-out
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || today}
                  className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="relative">
              <label className="block text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Tamu
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <button
                  onClick={() => setShowGuestPicker(!showGuestPicker)}
                  className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-2xl text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  {guests} Tamu
                </button>
                
                {showGuestPicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl p-4 shadow-elevated animate-slide-up">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Jumlah Tamu</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{guests}</span>
                        <button
                          onClick={() => setGuests(Math.min(10, guests + 1))}
                          className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span>Cek Ketersediaan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingBar;
