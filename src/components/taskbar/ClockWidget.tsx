import React, { useState, useEffect } from 'react';

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-end justify-center px-2.5 py-1 text-right select-none group cursor-default"
      title={`${date} — Local System Time`}
    >
      <span className="text-xs font-mono font-bold tracking-wider text-[var(--os-text-primary)] group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
        {time || '00:00:00'}
      </span>
      <span className="text-[10px] font-mono text-[var(--os-text-muted)] leading-none mt-0.5">
        {date}
      </span>
    </div>
  );
};
