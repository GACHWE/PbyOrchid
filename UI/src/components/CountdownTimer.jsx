import { useState, useEffect } from 'react';

export default function CountdownTimer({ initialHours = 12, initialMinutes = 45, initialSeconds = 30 }) {
  const [time, setTime] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev; // Timer finished
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4">
      <TimeUnit value={time.hours} label="HRS" />
      <Separator />
      <TimeUnit value={time.minutes} label="MIN" />
      <Separator />
      <TimeUnit value={time.seconds} label="SEC" />
    </div>
  );
}

const TimeUnit = ({ value, label }) => (
  <div className="text-center group">
    <p className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary-accent to-secondary-accent drop-shadow-lg transition-all duration-300 group-hover:scale-110">
      {String(value).padStart(2, '0')}
    </p>
    <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest mt-1">{label}</p>
  </div>
);

const Separator = () => (
  <span className="text-3xl md:text-4xl font-black text-app-border self-start mt-1 animate-pulse">:</span>
);