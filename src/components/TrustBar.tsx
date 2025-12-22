import { Bot, Zap, ShieldCheck } from 'lucide-react';

const trustItems = [
  {
    icon: Bot,
    title: 'Verified AI System',
    description: 'Asisten Luna 24/7',
  },
  {
    icon: Zap,
    title: 'Instant Confirmation',
    description: 'Konfirmasi real-time',
  },
  {
    icon: ShieldCheck,
    title: 'Secure QRIS Payment',
    description: 'Pembayaran aman',
  },
];

const TrustBar = () => {
  return (
    <section className="py-12 px-6 md:px-12 lg:px-20 border-y border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center gap-4 animate-fade-up stagger-${index + 1}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
