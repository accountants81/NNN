import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Quote } from 'lucide-react';
import { getStorageItem, setStorageItem, LOCAL_STORAGE_KEYS } from '../../lib/storage';

interface Message {
  id: string;
  text: string;
  date: string;
  status: 'pending' | 'approved';
}

export default function Biography() {
  const [bioText, setBioText] = useState("كان راجل محترم وخلوق، والكل يبشهد له بالخير. عاش حياته بيتقي الله في بيته، وربي أولاده أحسن تربية وطلعهم ناس محترمة زيه");
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const savedBio = localStorage.getItem(LOCAL_STORAGE_KEYS.BIO_TEXT);
    if (savedBio) setBioText(savedBio);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const messages = getStorageItem<Message[]>(LOCAL_STORAGE_KEYS.VISITOR_MESSAGES, []);
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      date: new Date().toLocaleString('ar-EG'),
      status: 'pending'
    };
    
    setStorageItem(LOCAL_STORAGE_KEYS.VISITOR_MESSAGES, [...messages, newMessage]);
    setMessage('');
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/10">
          <Quote className="w-8 h-8 text-primary opacity-40 shrink-0" />
        </div>
        <h2 className="text-3xl font-bold gold-text">سيرة عطرة</h2>
        <p className="text-white/60">عن الأستاذ خالد كوثر رحمه الله</p>
      </div>

      <div className="bg-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Quote className="w-32 h-32 text-white" />
        </div>
        <p className="text-lg md:text-xl text-white/90 text-center leading-[2] font-medium">
          "{bioText}"
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-center text-white/80">أضف دعاءً أو ذكرى صادقة للفقيد</h3>
        
        <div className="bg-card p-6 rounded-[2rem] border border-white/5 space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[160px] focus:border-primary outline-none transition-all resize-none text-white/90 placeholder:text-white/20 leading-relaxed"
            placeholder="اكتب كلمة، دعاء، أو رسالة حب..."
          />
          
          <button
            onClick={handleSendMessage}
            disabled={isSent || !message.trim()}
            className={`
              w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg transition-all duration-300
              ${isSent 
                ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                : 'bg-primary text-bg hover:shadow-xl hover:opacity-90 active:scale-[0.98]'}
            `}
          >
            {isSent ? (
              <>تم إرسال الرسالة</>
            ) : (
              <>
                <Send className="w-5 h-5 -rotate-12" />
                <span>إرسال الرسالة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
