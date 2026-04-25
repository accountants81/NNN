import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { getStorageItem, setStorageItem, LOCAL_STORAGE_KEYS } from '../../lib/storage';

const PRAYERS = [
  "اللهم اغفر للأستاذ خالد كوثر وارحمه",
  "اللهم اجعل مرضه شفيعاً له",
  "اللهم وسع مدخله وأدخله الجنة",
  "اللهم اجعل قبره روضة من رياض الجنة",
  "اللهم ثبته عند السؤال",
  "اللهم اجعل كل حرف يقرأ نوراً في قبره",
  "اللهم تقبل هذا العمل صدقة جارية عنه",
  "اللهم اجمعه مع الصالحين في الفردوس الأعلى"
];

export default function Prayers() {
  const [amenCount, setAmenCount] = useState(0);
  const [hasPrayed, setHasPrayed] = useState(false);

  useEffect(() => {
    setAmenCount(getStorageItem(LOCAL_STORAGE_KEYS.AMEN_COUNT, 0));
  }, []);

  const handleAmen = () => {
    if (hasPrayed) return;
    const newCount = amenCount + 1;
    setAmenCount(newCount);
    setStorageItem(LOCAL_STORAGE_KEYS.AMEN_COUNT, newCount);
    setHasPrayed(true);
    
    // Simple feedback message (optional but good)
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-primary" fill="currentColor" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold gold-text">أدعية مأثورة</h2>
        <p className="text-white/60">أخلصوا الدعاء للفقيد في ظهر الغيب</p>
      </div>

      <div className="grid gap-4">
        {PRAYERS.map((prayer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-card p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-500 relative flex items-center justify-between"
          >
            <p className="text-base md:text-lg text-white/90 font-medium leading-relaxed">
              {prayer}
            </p>
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/40 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              {index + 1}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 flex flex-col items-center gap-6">
        <button
          onClick={handleAmen}
          disabled={hasPrayed}
          className={`
            relative overflow-hidden px-16 py-5 rounded-3xl font-bold text-xl transition-all duration-500 active:scale-95
            ${hasPrayed 
              ? 'bg-white/5 text-white/20 border border-white/5 cursor-default' 
              : 'bg-primary text-bg hover:shadow-[0_10px_30px_rgba(197,160,89,0.3)] gold-shadow'}
          `}
        >
          {hasPrayed ? 'آمين' : 'آمين'}
          {!hasPrayed && (
             <motion.div 
               className="absolute inset-0 bg-white/20"
               initial={{ x: '-100%' }}
               animate={{ x: '100%' }}
               transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
             />
          )}
        </button>
        
        <div className="text-center">
          <p className="text-primary text-2xl font-bold">{amenCount.toLocaleString()}</p>
          <p className="text-white/40 text-xs">شخص دعوا له</p>
        </div>
      </div>
    </div>
  );
}
