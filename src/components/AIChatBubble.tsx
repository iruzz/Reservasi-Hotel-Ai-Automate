import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Halo! Saya Luna. Mau cek tanggal kosong atau tanya fasilitas hari ini? 😊',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Tentu! Untuk tanggal tersebut, kami memiliki Pool Suite yang tersedia. Mau saya bantu proses booking? 🏊‍♂️',
        'Fasilitas spa kami buka setiap hari dari pukul 10.00 - 21.00. Mau saya carikan jadwal treatment yang tersedia?',
        'Untuk transfer dari bandara, kami menyediakan layanan antar-jemput gratis. Cukup beri tahu waktu kedatangan Anda!',
        'Restoran kami menyajikan menu fusion Indonesia-Eropa dengan bahan organik lokal. Breakfast sudah termasuk untuk semua tamu.',
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full 
                   flex items-center justify-center shadow-elevated
                   transition-all duration-300 hover:scale-110
                   ${isOpen ? 'bg-foreground' : 'bg-primary'}`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-background" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] animate-slide-up">
          <div className="glass-strong rounded-3xl shadow-elevated overflow-hidden">
            {/* Header */}
            <div className="bg-primary p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-primary-foreground">
                    Luna AI
                  </h3>
                  <p className="text-primary-foreground/70 text-sm">Asisten Virtual Anda</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse stagger-1" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse stagger-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-2xl text-foreground 
                           placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 
                           transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center
                           hover:brightness-110 transition-all active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBubble;
