import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Download, Share2, Quote } from 'lucide-react';
import { domToPng } from 'modern-screenshot';

const CARDS = [
  {
    id: '1',
    text: "اللهم اغفر لفقيدنا وارحمه، وعافه واعف عنه، وأكرم نزله، ووسع مدخله، واغسله بالماء والثلج والبرد.",
    gradient: "linear-gradient(135deg, #2a2214 0%, #111111 100%)",
    filename: "بطاقة_خالد_كوثر_1.png"
  },
  {
    id: '2',
    text: "اللهم اجعل قبره روضة من رياض الجنة، ولا تجعله حفرة من حفر النار، اللهم افسح له في قبره مد بصره.",
    gradient: "linear-gradient(135deg, #1e1e1e 0%, #111111 100%)",
    filename: "بطاقة_خالد_كوثر_2.png"
  },
  {
    id: '3',
    text: "اللهم ارحمه فوق الأرض، وتحت الأرض، ويوم العرض عليك، اللهم قِهِ عذابك يوم تبعث عبادك.",
    gradient: "linear-gradient(135deg, #11221a 0%, #111111 100%)",
    filename: "بطاقة_خالد_كوثر_3.png"
  }
];

export const RemembranceCards: React.FC = () => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDownload = async (index: number, filename: string) => {
    const element = cardRefs.current[index];
    if (!element) return;

    setProcessingId(`download-${index}`);
    try {
      // modern-screenshot handles Arabic ligatures correctly
      const dataUrl = await domToPng(element, {
        scale: 2,
        backgroundColor: '#111111',
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: {
          transform: 'none',
          borderRadius: '32px'
        }
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
      
      alert('تم تحميل البطاقة بنجاح!');
    } catch (err) {
      console.error('Download failed:', err);
      alert('عذراً، حدث خطأ أثناء تحميل الصورة.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleShare = async (index: number) => {
    const element = cardRefs.current[index];
    if (!element) return;

    setProcessingId(`share-${index}`);
    try {
      const dataUrl = await domToPng(element, {
        scale: 2,
        backgroundColor: '#111111'
      });

      // Convert dataURL to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `card-${index + 1}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'صدقة جارية',
          text: 'دعاء لفقيدنا الأستاذ خالد كوثر',
          files: [file]
        });
      } else {
        const message = `صدقة جارية عن روح الأستاذ خالد كوثر - ${window.location.href}`;
        await navigator.clipboard.writeText(message);
        alert('تم نسخ رابط الموقع للمشاركة');
      }
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section id="remembrance" className="py-20 bg-black/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">بطاقات الذكرى</h2>
          <p className="text-white/60">اختر بطاقة وشاركها كصدقة جارية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col gap-4"
            >
              <div
                ref={el => cardRefs.current[index] = el}
                dir="rtl"
                className="relative aspect-[4/5] p-8 rounded-[32px] flex flex-col items-center justify-center text-center border border-white/5"
                style={{ 
                  background: card.gradient,
                  color: '#ffffff',
                }}
              >
                <Quote className="w-12 h-12 text-[#C5A059] mb-8 opacity-40 shrink-0" />
                <p className="text-xl md:text-2xl leading-relaxed font-medium mb-8 whitespace-pre-wrap">
                  {card.text}
                </p>
                <div className="mt-auto pt-8 border-t border-white/10 w-full">
                  <p className="text-[#C5A059] font-bold text-lg">الأستاذ خالد كوثر</p>
                  <p className="text-white/40 text-sm mt-1">رحمه الله وغفر له</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(index, card.filename)}
                  disabled={processingId !== null}
                  className="flex-1 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Download className={`w-5 h-5 ${processingId === `download-${index}` ? 'animate-pulse' : ''}`} />
                  <span>تحميل</span>
                </button>
                <button
                  onClick={() => handleShare(index)}
                  disabled={processingId !== null}
                  className="w-12 h-12 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                >
                  <Share2 className={`w-5 h-5 ${processingId === `share-${index}` ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
