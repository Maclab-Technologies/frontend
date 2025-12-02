"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate, onExpire }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsExpired(true);
        onExpire?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  const TimeUnit = ({ value, label }) => (
    <div className="text-center">
      <div className="bg-black/80 text-white text-3xl md:text-4xl font-bold py-3 px-4 rounded-lg min-w-[70px]">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-sm text-gray-300 mt-2">{label}</div>
    </div>
  );

  if (isExpired) {
    return (
      <div className="text-center py-4">
        <p className="text-2xl font-bold text-red-500">OFFER EXPIRED</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center space-x-4 md:space-x-6">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-2xl text-yellow-400">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-2xl text-yellow-400">:</span>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <span className="text-2xl text-yellow-400">:</span>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}