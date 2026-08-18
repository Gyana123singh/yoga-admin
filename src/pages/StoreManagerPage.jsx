import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Tag, Ticket, PackageCheck, Plus, Search, Edit2, Trash2, 
  Eye, CheckCircle, AlertTriangle, ArrowUpDown, Percent, DollarSign, Layers,
  X, Check, ExternalLink, Image as ImageIcon, Sparkles, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTargetUrls } from '../services/api';

export function StoreManagerPage() {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'categories' | 'coupons' | 'orders'
  
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (file, onSuccess) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      let data = null;
      for (const baseUrl of getTargetUrls()) {
        try {
          const res = await fetch(`${baseUrl}/store/upload`, {
            method: 'POST',
            body: formData
          });
          if (res.ok) {
            data = await res.json();
            break;
          }
        } catch (e) {}
      }
      if (data && data.success && data.url) {
        onSuccess(data.url);
        showToast('Image uploaded successfully via Cloudinary / Local storage!', 'success');
      } else {
        showToast(data?.message || 'Failed to upload image', 'danger');
      }
    } catch (err) {
      showToast('Error uploading image file', 'danger');
    } finally {
      setUploadingImage(false);
    }
  };

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    subtitle: '',
    description: '',
    category: '',
    price: '',
    mrp: '',
    badgeTag: '',
    images: [''],
    material: 'Cotton',
    tech: 'Bio Wash',
    colorsText: 'Black|#1E1E1E, Olive Green|#3B4E32',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stockCount: 10,
    rating: 4.5,
    reviewCount: 12,
    materialsCare: '100% Premium Bio-Washed Cotton. Machine wash cold with like colors. Tumble dry low or line dry in shade. Do not bleach or dry clean.',
    additionalInfo: 'Country of Origin: India. Net Quantity: 1 N. Manufactured & Packed by YogaPrana Wellness Pvt. Ltd.',
    applicableCoupon: 'YOGA10',
    couponDiscountPrice: '',
    isFeatured: true,
    isActive: true
  });

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    subtitle: '',
    badgeTag: '',
    imageUrl: '',
    slug: '',
    displayOrder: 0,
    isActive: true
  });

  // Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    status: 'Active'
  });

  // Fetch all store data on mount & attach Real-Time Listener with Polling Fallback
  useEffect(() => {
    fetchStoreData();

    let socketInstance = null;
    let pollInterval = null;

    // Try dynamic import of socket.io-client
    import('socket.io-client')
      .then(({ io }) => {
        const activeApiUrl = getTargetUrls()[0];
        const socketHost = activeApiUrl.replace(/\/api\/?$/, '');
        socketInstance = io(socketHost, { transports: ['websocket', 'polling'] });

        socketInstance.on('store:new-order', (newOrder) => {
          setOrders(prev => [newOrder, ...prev]);
          if (showToast) showToast(`🛒 Live Order Alert! #${newOrder.orderNumber} placed for ₹${newOrder.totalAmount}`, 'success');
        });

        socketInstance.on('store:catalog-updated', () => fetchStoreData());
        socketInstance.on('store:categories-updated', () => fetchStoreData());
        socketInstance.on('store:review-added', () => fetchStoreData());
      })
      .catch(() => {
        // Fallback: poll store data every 6 seconds if socket.io-client module is absent
        pollInterval = setInterval(() => {
          fetchStoreData();
        }, 6000);
      });

    return () => {
      if (socketInstance) socketInstance.disconnect();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  const fetchStoreData = async () => {
    setLoading(true);
    const activeApiUrl = getTargetUrls()[0];
    try {
      const [prodRes, catRes, coupRes, ordRes] = await Promise.all([
        fetch(`${activeApiUrl}/store/products/admin`).then(r => r.json()).catch(() => null),
        fetch(`${activeApiUrl}/store/categories/admin`).then(r => r.json()).catch(() => null),
        fetch(`${activeApiUrl}/store/coupons`).then(r => r.json()).catch(() => null),
        fetch(`${activeApiUrl}/store/orders`).then(r => r.json()).catch(() => null),
      ]);

      if (prodRes?.success) setProducts(prodRes.data);
      if (catRes?.success) setCategories(catRes.data);
      if (coupRes?.success) setCoupons(coupRes.data);
      if (ordRes?.success) setOrders(ordRes.data);
    } catch (e) {
      console.error('Failed to load store data:', e);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PRODUCT HANDLERS
  // ==========================================
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      let initialGallery = [];
      if (product.imageGallery && Array.isArray(product.imageGallery) && product.imageGallery.length > 0) {
        initialGallery = product.imageGallery.map(img => 
          typeof img === 'string' ? { url: img, isActive: true } : { url: img.url, isActive: img.isActive !== false }
        );
      } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        initialGallery = product.images.map(url => ({ url: typeof url === 'string' ? url : url.url, isActive: true }));
      }

      setProductForm({
        name: product.name || '',
        subtitle: product.subtitle || '',
        description: product.description || '',
        category: product.category?._id || product.category || '',
        price: product.price || '',
        mrp: product.mrp || '',
        badgeTag: product.badgeTag || '',
        images: product.images?.length ? product.images : [''],
        imageGallery: initialGallery,
        material: product.material || 'Cotton',
        tech: product.tech || 'Bio Wash',
        colorsText: product.colors?.map(c => `${c.name}|${c.hexCode}`).join(', ') || 'Black|#1E1E1E, Olive Green|#3B4E32',
        sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
        stockCount: product.stockCount ?? 10,
        rating: product.rating || 4.5,
        reviewCount: product.reviewCount || 12,
        materialsCare: product.materialsCare || '100% Premium Bio-Washed Cotton. Machine wash cold with like colors.',
        additionalInfo: product.additionalInfo || 'Country of Origin: India. Net Quantity: 1 N.',
        applicableCoupon: product.applicableCoupon || 'YOGA10',
        couponDiscountPrice: product.couponDiscountPrice || '',
        isFeatured: product.isFeatured ?? true,
        isActive: product.isActive ?? true
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        subtitle: '',
        description: '',
        category: categories[0]?._id || '',
        price: '',
        mrp: '',
        badgeTag: 'BESTSELLER',
        images: ['https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800'],
        imageGallery: [
          { url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800', isActive: true }
        ],
        material: 'Cotton',
        tech: 'Bio Wash',
        colorsText: 'Black|#1E1E1E, Olive Green|#3B4E32',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stockCount: 10,
        rating: 4.5,
        reviewCount: 15,
        materialsCare: '100% Premium Bio-Washed Cotton. Machine wash cold with like colors. Tumble dry low or line dry in shade.',
        additionalInfo: 'Country of Origin: India. Net Quantity: 1 N. Manufactured & Packed by YogaPrana Wellness Pvt. Ltd.',
        applicableCoupon: 'YOGA10',
        couponDiscountPrice: '',
        isFeatured: true,
        isActive: true
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const colorsParsed = productForm.colorsText.split(',').map(item => {
        const [name, hexCode] = item.trim().split('|');
        return { name: name || 'Color', hexCode: hexCode || '#000000', imageUrl: productForm.images[0] || '' };
      });

      const selectedCatId = productForm.category || (categories.length > 0 ? categories[0]._id : undefined);
      const activeGalleryUrls = (productForm.imageGallery || [])
        .filter(img => img.isActive !== false)
        .map(img => img.url);

      const payload = {
        ...productForm,
        ...(selectedCatId && { category: selectedCatId }),
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        couponDiscountPrice: productForm.couponDiscountPrice ? Number(productForm.couponDiscountPrice) : undefined,
        stockCount: Number(productForm.stockCount),
        colors: colorsParsed,
        imageGallery: productForm.imageGallery || [],
        images: activeGalleryUrls.length > 0 ? activeGalleryUrls : productForm.images
      };

      const url = editingProduct 
        ? `${API_BASE_URL}/store/products/${editingProduct._id}`
        : `${API_BASE_URL}/store/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showToast(editingProduct ? 'Product updated successfully!' : 'New product added!', 'success');
        setIsProductModalOpen(false);
        fetchStoreData();
      } else {
        showToast(data.message || 'Failed to save product', 'danger');
      }
    } catch (err) {
      showToast('Server connection error', 'danger');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/store/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Product deleted!', 'success');
        fetchStoreData();
      }
    } catch (e) {
      showToast('Failed to delete product', 'danger');
    }
  };

  // ==========================================
  // CATEGORY HANDLERS
  // ==========================================
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ ...cat });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        subtitle: '',
        badgeTag: '',
        imageUrl: '',
        slug: '',
        displayOrder: categories.length + 1,
        isActive: true
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory 
        ? `${API_BASE_URL}/store/categories/${editingCategory._id}`
        : `${API_BASE_URL}/store/categories`;
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();

      if (data.success) {
        showToast(editingCategory ? 'Category updated!' : 'Category created!', 'success');
        setIsCategoryModalOpen(false);
        fetchStoreData();
      } else {
        showToast(data.message || 'Failed to save category', 'danger');
      }
    } catch (e) {
      showToast('Error saving category', 'danger');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/store/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Category deleted!', 'success');
        fetchStoreData();
      }
    } catch (e) {
      showToast('Error deleting category', 'danger');
    }
  };

  // ==========================================
  // COUPON HANDLERS
  // ==========================================
  const handleOpenCouponModal = (coup = null) => {
    if (coup) {
      setEditingCoupon(coup);
      setCouponForm({ ...coup });
    } else {
      setEditingCoupon(null);
      setCouponForm({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 0,
        status: 'Active'
      });
    }
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    try {
      const url = editingCoupon 
        ? `${API_BASE_URL}/store/coupons/${editingCoupon._id}`
        : `${API_BASE_URL}/store/coupons`;
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponForm)
      });
      const data = await res.json();

      if (data.success) {
        showToast('Coupon saved successfully!', 'success');
        setIsCouponModalOpen(false);
        fetchStoreData();
      } else {
        showToast(data.message || 'Failed to save coupon', 'danger');
      }
    } catch (e) {
      showToast('Error saving coupon', 'danger');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete coupon code?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/store/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Coupon deleted!', 'success');
        fetchStoreData();
      }
    } catch (e) {
      showToast('Error deleting coupon', 'danger');
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category?._id === categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center text-white shadow-glow-primary">
              <ShoppingBag className="w-5 h-5" />
            </div>
            Yoga Kits & Store Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your store catalog, pricing, discounts, stock alerts, promo coupons, and customer orders.
          </p>
        </div>

        {/* Action Button depending on Active Tab */}
        <div>
          {activeTab === 'products' && (
            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-glow-primary flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          )}
          {activeTab === 'categories' && (
            <button
              onClick={() => handleOpenCategoryModal()}
              className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-glow-primary flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          )}
          {activeTab === 'coupons' && (
            <button
              onClick={() => handleOpenCouponModal()}
              className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-glow-primary flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Create Promo Coupon
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Products</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{products.length}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Categories</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{categories.length}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Coupons</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{coupons.length}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Store Orders</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{orders.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" /> Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'coupons'
              ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Ticket className="w-4 h-4" /> Coupons & Offers ({coupons.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <PackageCheck className="w-4 h-4" /> Customer Purchases ({orders.length})
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: PRODUCTS TABLE                                                */}
      {/* ==================================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price & MRP</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Badge</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400 font-semibold">
                        No products found. Click "Add Product" to create one!
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=200'}
                              alt={p.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div>
                              <h4 className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{p.name}</h4>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{p.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                          {p.category?.name || 'Uncategorized'}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                          ₹{p.price}{' '}
                          <span className="text-slate-400 line-through text-[10px] ml-1">₹{p.mrp}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold text-[10px]">
                            {p.discountPercent}% OFF
                          </span>
                        </td>
                        <td className="p-4">
                          {p.badgeTag ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold text-[10px]">
                              {p.badgeTag}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`font-bold ${p.stockCount <= 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {p.stockCount} left
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenProductModal(p)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: CATEGORIES GRID                                              */}
      {/* ==================================================================== */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="relative rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 overflow-hidden group shadow-xs">
              <div className="h-32 bg-slate-900 relative">
                <img
                  src={c.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600'}
                  alt={c.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {c.badgeTag && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 text-stone-900 text-[10px] font-black uppercase">
                    {c.badgeTag}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-base leading-tight">{c.name}</h3>
                  <p className="text-[11px] text-stone-300">{c.subtitle}</p>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between bg-white dark:bg-slate-900">
                <span className="text-[11px] font-mono text-slate-400">slug: /{c.slug}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCategoryModal(c)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-500"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c._id)}
                    className="p-1 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: COUPONS TABLE                                                 */}
      {/* ==================================================================== */}
      {activeTab === 'coupons' && (
        <div className="rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Code</th>
                <th className="p-4">Description</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">No coupons active. Create one!</td>
                </tr>
              ) : (
                coupons.map((coup) => (
                  <tr key={coup._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-black text-indigo-500 text-sm">{coup.code}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{coup.description || 'Flat promotional discount'}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {coup.discountType === 'fixed' ? `₹${coup.discountValue} OFF` : `${coup.discountValue}% OFF`}
                    </td>
                    <td className="p-4 font-mono">₹{coup.minOrderAmount}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-[10px]">
                        {coup.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenCouponModal(coup)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCoupon(coup._id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: ORDERS TABLE                                                  */}
      {/* ==================================================================== */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Order #</th>
                <th className="p-4">Customer Info</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">No store purchase orders yet.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{ord.orderNumber}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400">{ord.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          {item.quantity}x {item.name} ({item.selectedColor}, {item.selectedSize})
                        </div>
                      ))}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="p-4 font-bold text-emerald-500">{ord.paymentStatus} ({ord.paymentMethod})</td>
                    <td className="p-4 font-bold text-indigo-500">{ord.orderStatus}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ADD / EDIT PRODUCT MODAL                                             */}
      {/* ==================================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md p-4 flex justify-center items-start pt-10 sm:pt-14">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Store Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1 pt-3 font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Men's Breathable Flex Yoga Tank"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Subtitle / Short Tagline</label>
                <input
                  type="text"
                  value={productForm.subtitle}
                  onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                  placeholder="e.g. Breathable Stretch • Athletic Fit"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="499"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                    placeholder="1299"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Badge Tag</label>
                  <select
                    value={productForm.badgeTag}
                    onChange={(e) => setProductForm({ ...productForm, badgeTag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="">None</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="HOT">HOT</option>
                    <option value="NEW">NEW</option>
                    <option value="OFFERS">OFFERS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Material Tag</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    placeholder="Cotton"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Tech Spec Tag</label>
                  <input
                    type="text"
                    value={productForm.tech}
                    onChange={(e) => setProductForm({ ...productForm, tech: e.target.value })}
                    placeholder="Bio Wash"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={productForm.stockCount}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Promo Coupon Code</label>
                  <input
                    type="text"
                    value={productForm.applicableCoupon}
                    onChange={(e) => setProductForm({ ...productForm, applicableCoupon: e.target.value })}
                    placeholder="YOGA10"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Available Sizes</label>
                <div className="flex items-center gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                    const isSelected = productForm.sizes?.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const currentSizes = productForm.sizes || [];
                          const updated = isSelected 
                            ? currentSizes.filter(s => s !== sz) 
                            : [...currentSizes, sz];
                          setProductForm({ ...productForm, sizes: updated });
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                          isSelected 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Colors (Name|HexCode separated by commas)</label>
                <input
                  type="text"
                  value={productForm.colorsText}
                  onChange={(e) => setProductForm({ ...productForm, colorsText: e.target.value })}
                  placeholder="Black|#1E1E1E, Olive Green|#3B4E32"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400">
                    Product Image Gallery & Side Review ({productForm.imageGallery?.filter(i => i.isActive !== false).length || 0} Active / {productForm.imageGallery?.length || 0} Total)
                  </label>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {productForm.imageGallery?.filter(i => i.isActive !== false).length || 0} images will show to customer
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    id="newGalleryUrlInput"
                    placeholder="Paste Image URL or upload local file"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('newGalleryUrlInput');
                      if (input && input.value.trim()) {
                        const newUrl = input.value.trim();
                        const newGallery = [...(productForm.imageGallery || []), { url: newUrl, isActive: true }];
                        const activeUrls = newGallery.filter(i => i.isActive !== false).map(i => i.url);
                        setProductForm({ ...productForm, imageGallery: newGallery, images: activeUrls });
                        input.value = '';
                        showToast('Image added to gallery!', 'success');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    + Add URL
                  </button>
                  <label className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs">
                    <ImageIcon className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : '📁 Upload Local'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingImage}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          Array.from(e.target.files).forEach(file => {
                            handleFileUpload(file, (url) => {
                              setProductForm(prev => {
                                const updatedGallery = [...(prev.imageGallery || []), { url, isActive: true }];
                                const updatedActive = updatedGallery.filter(i => i.isActive !== false).map(i => i.url);
                                return { ...prev, imageGallery: updatedGallery, images: updatedActive };
                              });
                            });
                          });
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Gallery Cards Grid */}
                {productForm.imageGallery && productForm.imageGallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    {productForm.imageGallery.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border p-1.5 flex flex-col justify-between transition-all ${
                          img.isActive !== false
                            ? 'bg-white dark:bg-slate-900 border-emerald-500/50 shadow-xs ring-1 ring-emerald-500/20' 
                            : 'bg-slate-100 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="relative h-24 w-full rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 mb-1.5">
                          <img src={img.url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                            img.isActive !== false ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-slate-200'
                          }`}>
                            {img.isActive !== false ? '🟢 Active' : '⚪ Inactive'}
                          </span>
                          {idx === 0 && (
                            <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase shadow-xs">
                              ⭐ Cover
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedGallery = productForm.imageGallery.map((item, i) => 
                                i === idx ? { ...item, isActive: !(item.isActive !== false) } : item
                              );
                              const activeUrls = updatedGallery.filter(i => i.isActive !== false).map(i => i.url);
                              setProductForm({ ...productForm, imageGallery: updatedGallery, images: activeUrls });
                            }}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              img.isActive !== false 
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200' 
                                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                            }`}
                          >
                            {img.isActive !== false ? 'Set Inactive' : 'Set Active'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedGallery = productForm.imageGallery.filter((_, i) => i !== idx);
                              const activeUrls = updatedGallery.filter(i => i.isActive !== false).map(i => i.url);
                              setProductForm({ ...productForm, imageGallery: updatedGallery, images: activeUrls });
                            }}
                            className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs">
                    No images added yet. Paste a URL or click "Upload Local" above to add product review images.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Product Description</label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Designed for intensive yoga sessions and hot pranayama practice..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Materials & Care Instructions</label>
                <textarea
                  rows="2"
                  value={productForm.materialsCare}
                  onChange={(e) => setProductForm({ ...productForm, materialsCare: e.target.value })}
                  placeholder="100% Premium Bio-Washed Cotton. Machine wash cold..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Additional Information</label>
                <textarea
                  rows="2"
                  value={productForm.additionalInfo}
                  onChange={(e) => setProductForm({ ...productForm, additionalInfo: e.target.value })}
                  placeholder="Country of Origin: India. Net Quantity: 1 N."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold shadow-glow-primary"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md p-4 flex justify-center items-start pt-10 sm:pt-14">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl my-auto max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs overflow-y-auto flex-1 pr-1 pt-3 font-sans">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Women's Wear"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={categoryForm.subtitle}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subtitle: e.target.value })}
                  placeholder="e.g. Tops, Leggings &..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={categoryForm.badgeTag}
                    onChange={(e) => setCategoryForm({ ...categoryForm, badgeTag: e.target.value })}
                    placeholder="NEW / HOT / BESTSELLER"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={categoryForm.displayOrder}
                    onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Category Image (URL or Local Device Upload)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={categoryForm.imageUrl}
                    onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload local file"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs">
                    <ImageIcon className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : '📁 Upload Local File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], (url) => setCategoryForm(prev => ({ ...prev, imageUrl: url })));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {categoryForm.imageUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0">
                      <img src={categoryForm.imageUrl} alt="Category preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold">✓ Ready</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold shadow-glow-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingCoupon ? 'Edit Coupon' : 'Create Promo Code'}
              </h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. YOGA10"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase font-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  placeholder="Get ₹100 flat discount"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="fixed">Fixed Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    placeholder="100"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold shadow-glow-primary">
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
