import { Plus, Minus, ShoppingCart, X, MessageCircle, Globe, Settings, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminPanel } from './components/AdminPanel';

type Lang = 'tr' | 'ar';

interface Product {
  id: string;
  categoryId: string;
  name: { tr: string; ar: string };
  description: { tr: string; ar: string };
  price: number;
  image: string;
}

interface Category {
  id: string;
  name: { tr: string; ar: string };
}

const categories: Category[] = [
  { id: 'meals', name: { tr: 'Tavuk Dönerler (Porsiyon)', ar: 'وجبات الشاورما' } },
  { id: 'wraps', name: { tr: 'Dürümler', ar: 'ساندويشات الشاورما' } },
  { id: 'pides', name: { tr: 'Pideler', ar: 'المناقيش' } },
  { id: 'appetizers', name: { tr: 'Mezeler ve Falafel', ar: 'مقبلات وفلافل' } },
];

// Initial products will be overwritten by fetch
const initialProducts: Product[] = [
  // Meals
  {
    id: 'm1', categoryId: 'meals',
    name: { tr: 'Şavurma Porsiyon (130 g)', ar: 'وجبة شاورما عربي (130 غ)' },
    description: { tr: 'Şavurma, turşu, sarımsaklı sos ve patates kızartması', ar: 'شاورما، مخلل، صلصة ثوم وبطاطا مقلية' },
    price: 200,
    image: 'https://images.unsplash.com/photo-1645366479007-063996769e5d?w=300&h=300&fit=crop'
  },
  {
    id: 'm2', categoryId: 'meals',
    name: { tr: 'Şavurma (1.5 Porsiyon) (10 Dilim)', ar: 'وجبة شاورما ونص (10 قطع)' },
    description: { tr: 'Şavurma, turşu, sarımsaklı sos ve patates kızartması', ar: 'شاورما، مخلل، صلصة ثوم وبطاطا مقلية' },
    price: 250,
    image: 'https://images.unsplash.com/photo-1645366479007-063996769e5d?w=300&h=300&fit=crop'
  },
  {
    id: 'm3', categoryId: 'meals',
    name: { tr: 'Kaşarlı Şavurma (Porsiyon)', ar: 'وجبة شاورما بالجبنة' },
    description: { tr: 'Kaşar peynirli şavurma, turşu, sarımsaklı sos, patates kızartması ile', ar: 'شاورما بجبنة القشقوان، مخلل، صلصة ثوم، مع بطاطا مقلية' },
    price: 260,
    image: 'https://images.unsplash.com/photo-1645366479007-063996769e5d?w=300&h=300&fit=crop'
  },
  {
    id: 'm4', categoryId: 'meals',
    name: { tr: 'İtalyan Usulü Şavurma (Porsiyon)', ar: 'وجبة شاورما إيطالي' },
    description: { tr: '8 üçgen dilim şavurma, turşu, sarımsaklı sos, patates kızartması', ar: '8 شرائح شاورما مثلثة، مخلل، صلصة ثوم، بطاطا مقلية' },
    price: 300,
    image: 'https://images.unsplash.com/photo-1645366479007-063996769e5d?w=300&h=300&fit=crop'
  },
  {
    id: 'm5', categoryId: 'meals',
    name: { tr: 'Tavuk Döner (200 g)', ar: 'وجبة شاورما شرحات (200 غ)' },
    description: { tr: 'Şavurma, turşu, sarımsaklı sos, patates kızartması', ar: 'شاورما، مخلل، صلصة ثوم، بطاطا مقلية' },
    price: 285,
    image: 'https://images.unsplash.com/photo-1645366479007-063996769e5d?w=300&h=300&fit=crop'
  },
  {
    id: 'm6', categoryId: 'meals',
    name: { tr: 'Double Şavurma (270 g)', ar: 'وجبة شاورما دبل (270 غ)' },
    description: { tr: '15 dilim şavurma, turşu, sarımsaklı sos, patates kızartması', ar: '15 شريحة شاورما، مخلل، صلصة ثوم، بطاطا مقلية' },
    price: 370,
    image: 'https://images.unsplash.com/photo-1645366479007-063996769e5d?w=300&h=300&fit=crop'
  },

  // Wraps
  {
    id: 'w1', categoryId: 'wraps',
    name: { tr: 'Şavurma Dürüm (100 g)', ar: 'ساندويش شاورما (100 غ)' },
    description: { tr: 'Şavurma, turşu, sarımsaklı sos', ar: 'شاورما، مخلل، صلصة ثوم' },
    price: 135,
    image: 'https://images.unsplash.com/photo-1662116765993-4eb0058f4a13?w=300&h=300&fit=crop'
  },
  {
    id: 'w2', categoryId: 'wraps',
    name: { tr: 'Mega Şavurma Dürüm (130 g)', ar: 'ساندويش شاورما ميغا (130 غ)' },
    description: { tr: 'Şavurma, turşu, sarımsaklı sos', ar: 'شاورما، مخلل، صلصة ثوم' },
    price: 150,
    image: 'https://images.unsplash.com/photo-1662116765993-4eb0058f4a13?w=300&h=300&fit=crop'
  },
  {
    id: 'w3', categoryId: 'wraps',
    name: { tr: 'Kaşarlı Şavurma Dürüm (100 g)', ar: 'ساندويش شاورما بالجبنة (100 غ)' },
    description: { tr: 'Şavurma, kaşar peyniri, turşu, sarımsaklı sos', ar: 'شاورما، جبنة قشقوان، مخلل، صلصة ثوم' },
    price: 150,
    image: 'https://images.unsplash.com/photo-1662116765993-4eb0058f4a13?w=300&h=300&fit=crop'
  },
  {
    id: 'w4', categoryId: 'wraps',
    name: { tr: 'Ultra Mega Dürüm (150 g)', ar: 'ساندويش الترا ميغا (150 غ)' },
    description: { tr: 'Şavurma, turşu, sarımsaklı sos ve patates kızartması', ar: 'شاورما، مخلل، صلصة ثوم وبطاطا مقلية' },
    price: 150,
    image: 'https://images.unsplash.com/photo-1662116765993-4eb0058f4a13?w=300&h=300&fit=crop'
  },

  // Pides (Manakish)
  {
    id: 'p1', categoryId: 'pides',
    name: { tr: 'Kaşarlı Pide', ar: 'منقوشة قشقوان سادة' },
    description: { tr: 'Kaşar peyniri', ar: 'جبنة قشقوان' },
    price: 50,
    image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e58f?w=300&h=300&fit=crop'
  },
  {
    id: 'p2', categoryId: 'pides',
    name: { tr: 'Sucuklu Pide', ar: 'منقوشة سجق' },
    description: { tr: 'Sucuk', ar: 'سجق' },
    price: 40,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop'
  },
  {
    id: 'p3', categoryId: 'pides',
    name: { tr: 'Tavuklu Kaşarlı Pide', ar: 'منقوشة دجاج وقشقوان' },
    description: { tr: 'Tavuk ve kaşar peyniri', ar: 'دجاج وجبنة قشقوان' },
    price: 65,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=300&h=300&fit=crop'
  },
  {
    id: 'p4', categoryId: 'pides',
    name: { tr: 'Salamlı Pide', ar: 'منقوشة مرتديلا' },
    description: { tr: 'Salam', ar: 'مرتديلا' },
    price: 40,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=300&h=300&fit=crop'
  },
  {
    id: 'p5', categoryId: 'pides',
    name: { tr: 'Beyaz Peynirli Pide', ar: 'منقوشة جبنة بيضاء (شامية)' },
    description: { tr: 'Beyaz peynir', ar: 'جبنة بيضاء' },
    price: 35,
    image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e58f?w=300&h=300&fit=crop'
  },
  {
    id: 'p6', categoryId: 'pides',
    name: { tr: 'Krem Peynirli Pide', ar: 'منقوشة جبنة كيري' },
    description: { tr: 'Krem peynir', ar: 'جبنة كيري (كريمية)' },
    price: 35,
    image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e58f?w=300&h=300&fit=crop'
  },
  {
    id: 'p7', categoryId: 'pides',
    name: { tr: 'Zeytinli Pide', ar: 'منقوشة زيتون' },
    description: { tr: 'Zeytin', ar: 'زيتون' },
    price: 35,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=300&h=300&fit=crop'
  },
  {
    id: 'p8', categoryId: 'pides',
    name: { tr: 'Çikolatalı Pide', ar: 'منقوشة شوكولاه' },
    description: { tr: 'Çikolata', ar: 'شوكولاتة' },
    price: 40,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=300&h=300&fit=crop'
  },
  {
    id: 'p9', categoryId: 'pides',
    name: { tr: 'Salçalı Kaşarlı Pide', ar: 'منقوشة محمرة وقشقوان' },
    description: { tr: 'Salça ve kaşar peyniri', ar: 'محمرة وجبنة قشقوان' },
    price: 45,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300&h=300&fit=crop'
  },
  {
    id: 'p10', categoryId: 'pides',
    name: { tr: 'Salçalı Pide', ar: 'منقوشة محمرة' },
    description: { tr: 'Salça', ar: 'محمرة' },
    price: 35,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300&h=300&fit=crop'
  },
  {
    id: 'p11', categoryId: 'pides',
    name: { tr: 'Zahterli Kaşarlı Pide', ar: 'منقوشة زعتر وقشقوان' },
    description: { tr: 'Zahter ve kaşar peyniri', ar: 'زعتر وجبنة قشقوان' },
    price: 45,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop'
  },
  {
    id: 'p12', categoryId: 'pides',
    name: { tr: 'Zahterli Salçalı Pide', ar: 'منقوشة زعتر ومحمرة' },
    description: { tr: 'Zahter ve salça', ar: 'زعتر ومحمرة' },
    price: 35,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop'
  },
  {
    id: 'p13', categoryId: 'pides',
    name: { tr: 'Zahterli Pide', ar: 'منقوشة زعتر' },
    description: { tr: 'Zahter', ar: 'زعتر' },
    price: 35,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop'
  }
];

const uiStrings = {
  tr: {
    title: 'Efendim Restoran',
    subtitle: 'Şavurma, Pide, Falafel',
    viewCart: 'Sepeti Görüntüle',
    orderSummary: 'Sipariş Özeti',
    total: 'Toplam Tutar',
    orderWhatsApp: 'WhatsApp ile Sipariş Ver',
    whatsappMessagePrefix: 'Merhaba, sipariş vermek istiyorum:\n\n',
    whatsappTotal: 'Toplam'
  },
  ar: {
    title: 'مطعم أفندم',
    subtitle: 'شاورما، مناقيش، فلافل',
    viewCart: 'عرض السلة',
    orderSummary: 'ملخص الطلب',
    total: 'المجموع الإجمالي',
    orderWhatsApp: 'أطلب عبر واتساب',
    whatsappMessagePrefix: 'مرحباً، أود طلب الآتي:\n\n',
    whatsappTotal: 'المجموع'
  }
};

export default function App() {
  const [lang, setLang] = useState<Lang>('tr');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Dynamic data states
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [headerBackgroundImage, setHeaderBackgroundImage] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin states
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
        if (data.backgroundImage) {
          setBackgroundImage(data.backgroundImage);
        }
        if (data.headerBackgroundImage) {
          setHeaderBackgroundImage(data.headerBackgroundImage);
        }
        if (data.logo) {
          setLogo(data.logo);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data', err);
        setIsLoading(false);
      });
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: adminUser, password: adminPass })
    });
    if (res.ok) {
      const data = await res.json();
      setAdminToken(data.token);
      localStorage.setItem('admin_token', data.token);
      setShowAdminAuth(false);
      setShowAdminPanel(true);
      setAdminUser('');
      setAdminPass('');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('admin_token');
    setShowAdminPanel(false);
  };

  const t = uiStrings[lang];

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        if (Object.keys(copy).length === 0) {
          setIsCartOpen(false);
        }
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  
  const totalPrice = Object.entries(cart).reduce((total, [id, quantity]) => {
    const product = products.find(p => p.id === id);
    return total + (product ? product.price * quantity : 0);
  }, 0);

  const handleCheckout = () => {
    let text = t.whatsappMessagePrefix;
    
    Object.entries(cart).forEach(([id, quantity]) => {
      const product = products.find(p => p.id === id);
      if (product) {
        const lineTotal = product.price * quantity;
        text += `- ${quantity}x ${product.name[lang]} (${lineTotal.toFixed(2)} TL)\n`;
      }
    });
    
    text += `\n${t.whatsappTotal}: ${totalPrice.toFixed(2)} TL`;
    
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/905314077735?text=${encodedText}`;
    
    window.open(waUrl, '_blank');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'tr' ? 'ar' : 'tr');
  };

  return (
    <div 
      className={`min-h-screen text-zinc-100 font-sans pb-24 selection:bg-zinc-700 transition-all relative ${!backgroundImage ? 'neon-food-bg' : 'bg-[#1c1c1e]'}`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background Overlay */}
      {backgroundImage && (
        <div 
          className="fixed inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}

      {/* Header Banner */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden z-10" style={{ backgroundColor: headerBackgroundImage ? 'transparent' : '#a1a1aa' }}>
        {headerBackgroundImage && (
          <div 
            className="absolute inset-0 z-0"
            style={{ backgroundImage: `url(${headerBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}
        
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center flex-row-reverse" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
          <button 
            onClick={() => {
              if (adminToken) {
                setShowAdminPanel(true);
              } else {
                setShowAdminAuth(true);
              }
            }}
            className="flex items-center justify-center w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full transition-all"
          >
            <Settings size={16} />
          </button>

          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all"
          >
            <Globe size={16} />
            {lang === 'tr' ? 'العربية' : 'Türkçe'}
          </button>
        </div>

        {/* Abstract Background Element (Mimicking the logo shape in the background) */}
        {!logo && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-96 h-96 text-zinc-900 fill-current">
              <path d="M100,20 C140,20 170,50 170,90 C170,120 150,150 120,160 L120,130 C130,120 140,105 140,90 C140,70 125,50 100,50 C75,50 60,70 60,90 C60,110 75,130 95,140 L85,170 C45,155 30,120 30,90 C30,50 60,20 100,20 Z" />
              <circle cx="70" cy="80" r="10" />
              <path d="M130,50 Q160,30 180,60" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
              <path d="M80,140 L90,190 L110,190 L120,140" />
            </svg>
          </div>
        )}
        
        {/* Dark overlay at bottom of header */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1c1c1e] to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 text-center mt-12 flex flex-col items-center justify-center">
          {logo ? (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#1c1c1e] overflow-hidden shadow-2xl">
              <img src={logo || undefined} alt={t.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
                {t.title}
              </h1>
              <p className="mt-2 text-zinc-200 font-medium tracking-wide drop-shadow-md">
                {t.subtitle}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Product List */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {categories.map(category => {
          const categoryProducts = products.filter(p => p.categoryId === category.id);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.id} className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-100 border-b border-zinc-800 pb-2">
                {category.name[lang]}
              </h2>
              <div className="space-y-3">
                {categoryProducts.map((product) => {
                  const quantity = cart[product.id] || 0;
                  return (
                    <div key={product.id} className="flex items-center gap-4 bg-[#1c1c1e]/90 backdrop-blur-md p-2 rounded-xl group transition-colors hover:bg-zinc-800/80 border border-white/5">
                      <div className="shrink-0 relative overflow-hidden rounded-xl">
                        <img 
                          src={product.image || undefined} 
                          alt={product.name[lang]} 
                          className="w-24 h-24 object-cover"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0 py-1">
                        <h3 className="font-semibold text-[17px] text-zinc-100 leading-tight">
                          {product.name[lang]}
                        </h3>
                        <p className="text-[13px] text-zinc-400 mt-1 line-clamp-2 leading-snug">
                          {product.description[lang]}
                        </p>
                        <p className="text-[15px] font-medium text-emerald-400 mt-1.5">
                          {product.price.toFixed(2)} TL
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center justify-end px-2">
                        {quantity === 0 ? (
                          <button
                            onClick={() => updateCart(product.id, 1)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors active:scale-95"
                            aria-label="Add to cart"
                          >
                            <Plus size={20} strokeWidth={2.5} />
                          </button>
                        ) : (
                          <div className="flex flex-col items-center gap-2 bg-zinc-800/80 rounded-xl border border-zinc-700/50 p-1.5">
                            <button
                              onClick={() => updateCart(product.id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-700 text-zinc-200 active:scale-95 transition-transform"
                            >
                              <Plus size={18} strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center font-bold text-[15px] tabular-nums">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCart(product.id, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-700 text-zinc-200 active:scale-95 transition-transform"
                            >
                              <Minus size={18} strokeWidth={2.5} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {/* Floating Bottom Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 p-4 z-40 flex justify-center pointer-events-none"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-900/20 pointer-events-auto active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={22} />
                  <span className="absolute -top-2 -right-2 bg-emerald-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-emerald-600" style={{ right: lang === 'ar' ? 'auto' : '-0.5rem', left: lang === 'ar' ? '-0.5rem' : 'auto' }}>
                    {totalItems}
                  </span>
                </div>
                <span className="font-semibold text-lg">{t.viewCart}</span>
              </div>
              <span className="font-bold text-lg tabular-nums">
                {totalPrice.toFixed(2)} TL
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal / Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-[#1c1c1e] border-t border-zinc-800 rounded-t-3xl shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-800 shrink-0">
                <h2 className="text-xl font-bold">{t.orderSummary}</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
                  style={{ marginRight: lang === 'ar' ? 'auto' : '-0.5rem', marginLeft: lang === 'ar' ? '-0.5rem' : 'auto' }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-5 space-y-4 max-w-2xl mx-auto w-full flex-1">
                {Object.entries(cart).map(([id, quantity]) => {
                  const product = products.find(p => p.id === id);
                  if (!product) return null;
                  
                  return (
                    <div key={id} className="flex justify-between items-center bg-zinc-800/30 p-3 rounded-xl border border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-emerald-500 min-w-[2ch]">
                          {quantity}x
                        </span>
                        <span className="font-medium text-zinc-200">
                          {product.name[lang]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-400 font-medium tabular-nums text-sm">
                          {(product.price * quantity).toFixed(2)} TL
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-5 border-t border-zinc-800 shrink-0 bg-[#1c1c1e]/90 backdrop-blur pb-8 max-w-2xl mx-auto w-full">
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="text-zinc-400 font-medium">{t.total}</span>
                  <span className="text-2xl font-bold tabular-nums text-white">
                    {totalPrice.toFixed(2)} TL
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#20b858] text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-bold text-lg active:scale-[0.98] transition-all shadow-lg shadow-[#25D366]/20"
                >
                  <MessageCircle size={24} />
                  {t.orderWhatsApp}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Admin Auth Modal */}
      <AnimatePresence>
        {showAdminAuth && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setShowAdminAuth(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
              dir="ltr"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-zinc-100">
                    <Lock className="w-5 h-5 text-amber-500" />
                    Admin Login
                  </h3>
                  <button onClick={() => setShowAdminAuth(false)} className="p-2 hover:bg-zinc-800 text-zinc-400 rounded-full transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
                    <input 
                      type="text" 
                      value={adminUser}
                      onChange={e => setAdminUser(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                    <input 
                      type="password" 
                      value={adminPass}
                      onChange={e => setAdminPass(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition">
                    Login
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      {showAdminPanel && adminToken && (
        <AdminPanel 
          token={adminToken} 
          onLogout={handleLogout}
          products={products}
          backgroundImage={backgroundImage}
          headerBackgroundImage={headerBackgroundImage}
          logo={logo}
          onUpdateProducts={setProducts}
          onUpdateSettings={(bg, headerBg, newLogo) => {
            setBackgroundImage(bg);
            setHeaderBackgroundImage(headerBg);
            setLogo(newLogo);
          }}
        />
      )}
    </div>
  );
}
