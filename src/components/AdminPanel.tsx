import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trash2, 
  CheckCircle, 
  Clock, 
  Users, 
  BookOpen, 
  Sparkles,
  RefreshCw,
  LogOut,
  Edit2
} from 'lucide-react';
import { getStorageItem, setStorageItem, LOCAL_STORAGE_KEYS } from '../lib/storage';

interface Message {
  id: string;
  text: string;
  date: string;
  status: 'pending' | 'approved';
}

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    amenCount: 0,
    khatmaCount: 0,
    messagesCount: 0
  });
  const [bioText, setBioText] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const msgs = getStorageItem<Message[]>(LOCAL_STORAGE_KEYS.VISITOR_MESSAGES, []);
    setMessages(msgs);
    
    setStats({
      amenCount: getStorageItem(LOCAL_STORAGE_KEYS.AMEN_COUNT, 0),
      khatmaCount: getStorageItem(LOCAL_STORAGE_KEYS.COMPLETED_KHATMAS, 0),
      messagesCount: msgs.length
    });

    const savedBio = localStorage.getItem(LOCAL_STORAGE_KEYS.BIO_TEXT);
    setBioText(savedBio || "كان راجل محترم وخلوق، والكل يبشهد له بالخير. عاش حياته بيتقي الله في بيته، وربي أولاده أحسن تربية وطلعهم ناس محترمة زيه");
  };

  const handleMessageStatus = (id: string, status: 'approved' | 'rejected') => {
    let newMessages;
    if (status === 'rejected') {
      newMessages = messages.filter(m => m.id !== id);
    } else {
      newMessages = messages.map(m => m.id === id ? { ...m, status } : m);
    }
    setMessages(newMessages);
    setStorageItem(LOCAL_STORAGE_KEYS.VISITOR_MESSAGES, newMessages);
    loadData();
  };

  const saveBio = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BIO_TEXT, bioText);
    setIsEditingBio(false);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gold-text">لوحة التحكم</h2>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors"
        >
          <span>تسجيل الخروج</span>
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Users} label="عدد الدعوات" value={stats.amenCount} />
        <StatCard icon={BookOpen} label="الختمات المكتملة" value={stats.khatmaCount} />
        <StatCard icon={Clock} label="رسائل الزوار" value={stats.messagesCount} />
      </div>

      {/* Content Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">إدارة نصوص الموقع</h3>
          {!isEditingBio ? (
            <button onClick={() => setIsEditingBio(true)} className="p-2 bg-white/5 rounded-lg text-primary">
              <Edit2 className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={saveBio} className="px-4 py-2 bg-primary text-bg rounded-lg font-bold text-xs uppercase">حفظ</button>
          )}
        </div>
        
        <div className="bg-card p-6 rounded-2xl border border-white/5">
          <label className="block text-xs text-white/40 mb-2 font-medium">نص السيرة (سيرة عطرة)</label>
          <textarea
            disabled={!isEditingBio}
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[120px] focus:border-primary outline-none transition-all disabled:opacity-50 text-white/80"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">إدارة رسائل الزوار</h3>
          <button onClick={loadData} className="p-2 bg-white/5 rounded-lg text-white/60">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-card p-12 rounded-2xl border border-white/5 text-center text-white/20">
              لا توجد رسائل حالياً
            </div>
          ) : (
            messages.slice().reverse().map((msg) => (
              <div key={msg.id} className="bg-card p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-start justify-between">
                   <div className="space-y-1">
                     <p className="text-xs text-white/30">{msg.date}</p>
                     <p className="text-white/80 leading-relaxed">{msg.text}</p>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase ${msg.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                     {msg.status === 'approved' ? 'منشورة' : 'انتظار'}
                   </span>
                </div>
                
                <div className="flex gap-2 justify-end border-t border-white/5 pt-4">
                  {msg.status !== 'approved' && (
                    <button 
                      onClick={() => handleMessageStatus(msg.id, 'approved')}
                      className="flex items-center gap-2 bg-green-500 text-bg px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      <CheckCircle className="w-3 h-3" />
                      موافقة
                    </button>
                  )}
                  <button 
                    onClick={() => handleMessageStatus(msg.id, 'rejected')}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    <Trash2 className="w-3 h-3" />
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-white/5 flex items-center gap-6">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-white/40 text-xs font-medium">{label}</p>
        <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}
