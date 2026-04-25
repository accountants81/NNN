import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Sparkles, 
  History, 
  Music, 
  Image as ImageIcon,
  Lock,
  ChevronLeft,
  CircleCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Sections ---
import Prayers from './components/sections/Prayers';
import Quran from './components/sections/Quran';
import Treasures from './components/sections/Treasures';
import Biography from './components/sections/Biography';
import AudioLibrary from './components/sections/AudioLibrary';
import { RemembranceCards } from './components/sections/RemembranceCards';
import AdminPanel from './components/AdminPanel';

type Section = 'home' | 'quran' | 'treasures' | 'bio' | 'audio' | 'cards' | 'admin';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const titles: Record<Section, string> = {
      home: 'صدقة جارية | الرئيسية',
      quran: 'خدمة القرآن | ختمة جماعية',
      treasures: 'الكنوز السبعة | الأذكار',
      bio: 'سيرة عطرة | خالد كوثر',
      audio: 'المكتبة الصوتية | القرآن الكريم',
      cards: 'بطاقات الدعاء | تحميل',
      admin: 'لوحة التحكم | المسؤول'
    };
    document.title = titles[activeSection];
  }, [activeSection]);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'quran', label: 'ختمة القرآن', icon: BookOpen },
    { id: 'treasures', label: 'الكنوز السبعة', icon: Sparkles },
    { id: 'bio', label: 'سيرة عطرة', icon: History },
    { id: 'audio', label: 'المكتبة الصوتية', icon: Music },
    { id: 'cards', label: 'بطاقات الدعاء', icon: ImageIcon },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <Prayers />;
      case 'quran': return <Quran />;
      case 'treasures': return <Treasures />;
      case 'bio': return <Biography />;
      case 'audio': return <AudioLibrary />;
      case 'cards': return <RemembranceCards />;
      case 'admin': return <AdminPanel onLogout={() => { setIsAdminLoggedIn(false); setActiveSection('home'); }} />;
      default: return <Prayers />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg selection:bg-primary/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-95"
        >
          <Menu className="w-6 h-6 text-primary" />
        </button>
        
        <h1 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2">
          <span className="hidden sm:inline text-white/40 font-normal">|</span>
          صدقة جارية | الأستاذ خالد كوثر
        </h1>
        
        <div className="w-10 h-10" /> {/* Spacer for balance */}
      </header>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden" // Removed backdrop-blur for performance
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }} // Faster and tween for reliability
              className="fixed top-0 right-0 h-full w-[280px] bg-[#1a1a1a] z-[60] p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-primary">القائمة</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-full active:scale-90 transition-transform">
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id as Section);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200",
                      activeSection === item.id 
                        ? "bg-primary text-bg font-bold" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="pt-6 border-t border-white/5 mt-auto text-center space-y-1">
                <p className="text-xs text-white/40">عن روح الأستاذ خالد كوثر</p>
                <p className="text-xs text-primary/60 font-medium">رحمه الله وغفر له</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <motion.div
           key={activeSection}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.15, ease: "linear" }}
        >
          {renderSection()}
          
          {activeSection === 'home' && (
            <div className="mt-12 text-center">
              <p className="text-white/40 flex items-center justify-center gap-2">
                <span>👉 اضغط على</span>
                <span className="p-1 bg-white/5 rounded"><Menu className="w-4 h-4 inline" /></span>
                <span>في الأعلى للانتقال بين الأقسام</span>
              </p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-10 px-4 bg-[#0d0d0d] border-t border-white/5 text-center space-y-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-primary text-xl font-bold mb-4">صدقة جارية | الأستاذ خالد كوثر</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6 italic">
            "اللهم اجعل هذا العمل صدقة جارية في ميزان حسناته ونوراً له في قبره"
          </p>
          
          <div className="h-px bg-white/5 w-full mb-6" />
          
          <p className="text-white/30 text-[10px] mb-4">جميع الحقوق محفوظة © 2026</p>
          
          <button 
            onClick={() => {
              if (isAdminLoggedIn) setActiveSection('admin');
              else setShowAdminLogin(true);
            }}
            className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors text-xs"
          >
            <Lock className="w-3 h-3" />
            <span>دخول المسؤول</span>
          </button>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminLogin(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card p-8 rounded-2xl border border-white/10 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-bold text-center mb-6">دخول المسؤول</h3>
              <AdminLoginForm 
                onSuccess={() => {
                  setIsAdminLoggedIn(true);
                  setShowAdminLogin(false);
                  setActiveSection('admin');
                }} 
                onCancel={() => setShowAdminLogin(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminLoginForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '01010694146') {
      onSuccess();
    } else {
      setError('رقم غير صحيح. حاول مرة أخرى');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/60 mb-2">كلمة المرور</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-center placeholder:text-white/20"
          placeholder="أدخل كلمة المرور"
        />
        {error && <p className="text-red-500 text-[10px] mt-2 text-center">{error}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button 
          type="submit"
          className="flex-1 bg-primary text-bg font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          تأكيد
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white/5 py-3 rounded-xl hover:bg-white/10 transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
