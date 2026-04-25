import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Hand } from 'lucide-react';
import { getStorageItem, setStorageItem, LOCAL_STORAGE_KEYS } from '../../lib/storage';

const TREASURES = [
  { id: '1', title: 'سبحان الله وبحمده', defaultTarget: 33 },
  { id: '2', title: 'سبحان الله العظيم', defaultTarget: 33 },
  { id: '3', title: 'لا إله إلا الله', defaultTarget: 33 },
  { id: '4', title: 'الحمد لله', defaultTarget: 33 },
  { id: '5', title: 'الله أكبر', defaultTarget: 33 },
  { id: '6', title: 'لا حول ولا قوة إلا بالله', defaultTarget: 33 },
  { id: '7', title: 'أستغفر الله وأتوب إليه', defaultTarget: 33 },
];

interface Progress {
  count: number;
  target: number;
}

export default function Treasures() {
  const [progress, setProgress] = useState<Record<string, Progress>>({});

  useEffect(() => {
    const saved = getStorageItem<Record<string, Progress>>(LOCAL_STORAGE_KEYS.TREASURES_PROGRESS, {});
    const initialProgress: Record<string, Progress> = {};
    TREASURES.forEach(t => {
      initialProgress[t.id] = saved[t.id] || { count: 0, target: t.defaultTarget };
    });
    setProgress(initialProgress);
  }, []);

  const handleIncrement = (id: string) => {
    const current = progress[id];
    const newCount = current.count + 1;
    
    if (newCount >= current.target) {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      alert("أكملت التسبيحة - جعلها الله في ميزان حسنات الأستاذ خالد كوثر");
      updateItem(id, { ...current, count: 0 });
    } else {
      updateItem(id, { ...current, count: newCount });
      if (navigator.vibrate) navigator.vibrate(20);
    }
  };

  const handleTargetChange = (id: string, newTarget: number) => {
    const current = progress[id];
    updateItem(id, { ...current, target: Math.max(1, newTarget) });
  };

  const handleReset = (id: string) => {
    const current = progress[id];
    updateItem(id, { ...current, count: 0 });
  };

  const updateItem = (id: string, item: Progress) => {
    const newProgress = { ...progress, [id]: item };
    setProgress(newProgress);
    setStorageItem(LOCAL_STORAGE_KEYS.TREASURES_PROGRESS, newProgress);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <SparklesIcon />
        </div>
        <h2 className="text-3xl font-bold gold-text">الكنوز السبعة</h2>
        <p className="text-white/60">حسن نفسك وأرسل ثواب أذكارك للأستاذ خالد كوثر</p>
      </div>

      <div className="grid gap-8">
        {TREASURES.map((treasure) => {
          const data = progress[treasure.id] || { count: 0, target: treasure.defaultTarget };
          const percentage = (data.count / data.target) * 100;
          
          return (
             <motion.div 
               key={treasure.id}
               className="bg-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group"
             >
               <button 
                 onClick={() => handleReset(treasure.id)}
                 className="absolute top-6 left-6 p-2 text-white/20 hover:text-primary transition-colors hover:rotate-[-90deg] duration-500"
               >
                 <RotateCcw className="w-5 h-5" />
               </button>

               <div className="text-center space-y-6">
                 <h3 className="text-2xl font-bold text-white/90">{treasure.title}</h3>
                 
                 <div className="flex flex-col items-center gap-6">
                    {/* Ring Counter */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          fill="transparent"
                          stroke="rgba(255,255,255,0.03)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="58"
                          fill="transparent"
                          stroke="#C5A059"
                          strokeWidth="8"
                          strokeDasharray={364.4}
                          initial={{ strokeDashoffset: 364.4 }}
                          animate={{ strokeDashoffset: 364.4 - (364.4 * Math.min(percentage, 100)) / 100 }}
                          strokeLinecap="round"
                          transition={{ type: 'spring', damping: 20 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{data.count}</span>
                        <span className="text-[10px] text-white/30">/ {data.target}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40">الهدف:</span>
                      <input 
                        type="number" 
                        value={data.target}
                        onChange={(e) => handleTargetChange(treasure.id, parseInt(e.target.value) || 1)}
                        className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-center text-primary font-bold focus:border-primary/50 outline-none"
                      />
                    </div>

                    <button
                      onClick={() => handleIncrement(treasure.id)}
                      className="w-full bg-primary text-bg font-bold py-5 rounded-2xl text-xl hover:shadow-[0_10px_30px_rgba(197,160,89,0.3)] transition-all active:scale-[0.98] gold-shadow"
                    >
                      سبّح
                    </button>
                 </div>
               </div>
             </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
