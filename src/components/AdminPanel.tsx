import React, { useState } from 'react';
import { Settings, Plus, Trash2, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  token: string;
  onLogout: () => void;
  products: any[];
  backgroundImage: string | null;
  headerBackgroundImage: string | null;
  logo: string | null;
  onUpdateProducts: (products: any[]) => void;
  onUpdateSettings: (bg: string, headerBg: string, logo: string) => void;
}

export function AdminPanel({ token, onLogout, products, backgroundImage, headerBackgroundImage, logo, onUpdateProducts, onUpdateSettings }: AdminPanelProps) {
  const [bgInput, setBgInput] = useState(backgroundImage || '');
  const [headerBgInput, setHeaderBgInput] = useState(headerBackgroundImage || '');
  const [logoInput, setLogoInput] = useState(logo || '');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const defaultProduct = {
    categoryId: 'meals',
    name: { tr: '', ar: '' },
    description: { tr: '', ar: '' },
    price: '',
    image: ''
  };

  const [formData, setFormData] = useState(defaultProduct);

  const handleUpdateSettings = async () => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ backgroundImage: bgInput, headerBackgroundImage: headerBgInput, logo: logoInput })
    });
    if (res.ok) {
      onUpdateSettings(bgInput, headerBgInput, logoInput);
      alert('Settings updated!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'bg' | 'headerBg' | 'logo' | 'product') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (field === 'bg') {
        setBgInput(base64);
      } else if (field === 'headerBg') {
        setHeaderBgInput(base64);
      } else if (field === 'logo') {
        setLogoInput(base64);
      } else {
        setFormData(prev => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProduct = async () => {
    const isEdit = !!editingProductId;
    const url = isEdit ? `/api/products/${editingProductId}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ product: { ...formData, price: Number(formData.price) } })
    });

    if (res.ok) {
      const { product } = await res.json();
      if (isEdit) {
        onUpdateProducts(products.map((p: any) => p.id === editingProductId ? product : p));
      } else {
        onUpdateProducts([...products, product]);
      }
      setFormData(defaultProduct);
      setEditingProductId(null);
      alert(`Product ${isEdit ? 'updated' : 'added'}!`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      onUpdateProducts(products.filter((p: any) => p.id !== id));
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setFormData({
      categoryId: product.categoryId,
      name: { tr: product.name.tr, ar: product.name.ar },
      description: { tr: product.description?.tr || '', ar: product.description?.ar || '' },
      price: product.price.toString(),
      image: product.image || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setFormData(defaultProduct);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121214]/95 backdrop-blur-xl overflow-y-auto text-zinc-100" dir="ltr">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
          <button onClick={onLogout} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition">
            Logout
          </button>
        </div>

        <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-zinc-200">Appearance Settings</h3>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Main Background Image</label>
              <div className="flex gap-4 mb-2">
                <input 
                  type="text" 
                  value={bgInput.startsWith('data:image') ? 'Uploaded Image (Base64)' : bgInput} 
                  onChange={e => {
                    if (e.target.value !== 'Uploaded Image (Base64)') {
                      setBgInput(e.target.value);
                    }
                  }}
                  placeholder="Main Background Image URL or Upload"
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <label className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 cursor-pointer flex items-center justify-center transition">
                  <Upload className="w-5 h-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'bg')} />
                </label>
              </div>
              {bgInput && (
                <div className="w-full h-32 rounded-lg border border-zinc-700 overflow-hidden relative">
                  <img src={bgInput || undefined} alt="Main Background Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Header Background Image (Behind Logo)</label>
              <div className="flex gap-4 mb-2">
                <input 
                  type="text" 
                  value={headerBgInput.startsWith('data:image') ? 'Uploaded Image (Base64)' : headerBgInput} 
                  onChange={e => {
                    if (e.target.value !== 'Uploaded Image (Base64)') {
                      setHeaderBgInput(e.target.value);
                    }
                  }}
                  placeholder="Header Background Image URL or Upload"
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <label className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 cursor-pointer flex items-center justify-center transition">
                  <Upload className="w-5 h-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'headerBg')} />
                </label>
              </div>
              {headerBgInput && (
                <div className="w-full h-32 rounded-lg border border-zinc-700 overflow-hidden relative">
                  <img src={headerBgInput || undefined} alt="Header Background Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Restaurant Logo</label>
              <div className="flex gap-4 mb-2">
                <input 
                  type="text" 
                  value={logoInput.startsWith('data:image') ? 'Uploaded Image (Base64)' : logoInput} 
                  onChange={e => {
                    if (e.target.value !== 'Uploaded Image (Base64)') {
                      setLogoInput(e.target.value);
                    }
                  }}
                  placeholder="Logo URL or Upload"
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <label className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 cursor-pointer flex items-center justify-center transition">
                  <Upload className="w-5 h-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'logo')} />
                </label>
              </div>
              {logoInput && (
                <div className="w-32 h-32 rounded-full border border-zinc-700 overflow-hidden relative bg-zinc-900">
                  <img src={logoInput || undefined} alt="Logo Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button onClick={handleUpdateSettings} className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium">
              Save Appearance Settings
            </button>
          </div>
        </div>

        <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-zinc-200">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
            {editingProductId && (
              <button onClick={handleCancelEdit} className="text-sm text-red-400 hover:text-red-300">
                Cancel Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select 
              value={formData.categoryId}
              onChange={e => setFormData({...formData, categoryId: e.target.value})}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none"
            >
              <option value="meals">Meals (وجبات)</option>
              <option value="wraps">Wraps (ساندويشات)</option>
              <option value="pides">Pides (مناقيش)</option>
              <option value="appetizers">Appetizers (مقبلات)</option>
            </select>
            <input 
              type="number" 
              placeholder="Price (TL)" 
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none"
            />
            <input 
              type="text" 
              placeholder="Name (Turkish)" 
              value={formData.name.tr}
              onChange={e => setFormData({...formData, name: {...formData.name, tr: e.target.value}})}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none"
            />
            <input 
              type="text" 
              placeholder="Name (Arabic)" 
              value={formData.name.ar}
              onChange={e => setFormData({...formData, name: {...formData.name, ar: e.target.value}})}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none text-right"
              dir="rtl"
            />
            <input 
              type="text" 
              placeholder="Description (Turkish)" 
              value={formData.description.tr}
              onChange={e => setFormData({...formData, description: {...formData.description, tr: e.target.value}})}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none"
            />
            <input 
              type="text" 
              placeholder="Description (Arabic)" 
              value={formData.description.ar}
              onChange={e => setFormData({...formData, description: {...formData.description, ar: e.target.value}})}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none text-right"
              dir="rtl"
            />
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Image URL or Upload" 
                  value={formData.image.startsWith('data:image') ? 'Uploaded Image (Base64)' : formData.image}
                  onChange={e => {
                    if (e.target.value !== 'Uploaded Image (Base64)') {
                      setFormData({...formData, image: e.target.value});
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none"
                />
                <label className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 cursor-pointer flex items-center justify-center transition">
                  <Upload className="w-5 h-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'product')} />
                </label>
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img src={formData.image || undefined} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-zinc-700" />
                </div>
              )}
            </div>
          </div>
          <button onClick={handleSubmitProduct} className="w-full py-3 bg-amber-600/20 text-amber-500 hover:bg-amber-600/30 font-medium rounded-lg transition">
            {editingProductId ? 'Update Product' : 'Add Product'}
          </button>
        </div>

        <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-zinc-200">Manage Products</h3>
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-700/50 rounded-xl">
                <img src={product.image || undefined} alt="" className="w-16 h-16 object-cover rounded-lg bg-zinc-800" />
                <div className="flex-1">
                  <div className="font-medium">{product.name.tr}</div>
                  <div className="text-sm text-zinc-400">{product.price} TL</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="px-3 py-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
