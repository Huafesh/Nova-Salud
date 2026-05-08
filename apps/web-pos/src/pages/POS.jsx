import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Trash2, CheckCircle } from 'lucide-react';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    // Auto focus search for barcode scanner
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    // Check if exact barcode match
    const exactMatch = products.find(p => p.barcode === searchTerm);
    if (exactMatch) {
      addToCart(exactMatch);
      setSearchTerm(''); // Clear for next scan
    }
  };

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert(`Sin stock de: ${product.name}`);
      return;
    }

    const existingItem = cart.find(item => item.product._id === product._id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('No hay suficiente stock');
        return;
      }
      setCart(cart.map(item => 
        item.product._id === product._id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, subtotal: product.price }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product._id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    
    const items = cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      unitPrice: item.product.price,
      subtotal: item.subtotal
    }));

    try {
      await axios.post('/sales', {
        items,
        paymentMethod: 'efectivo',
        receiptType: 'digital'
      });
      
      setCart([]);
      setSuccessMsg('¡Venta Registrada Exitosamente!');
      fetchProducts(); // Refresh stock
      
      setTimeout(() => setSuccessMsg(''), 3000);
      if (searchInputRef.current) searchInputRef.current.focus();
      
    } catch (error) {
      alert(error.response?.data?.message || 'Error al procesar la venta');
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
      
      {/* LEFT PANEL - PRODUCTS */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', padding: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={24} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Escanear código de barras o buscar producto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', fontSize: '1.25rem', fontWeight: 'bold', border: '1px solid var(--accent-color)', backgroundColor: 'var(--bg-primary)' }}
            />
          </div>
        </form>

        <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', alignContent: 'start' }}>
          {filteredProducts.map(product => {
             const isOutOfStock = product.stock <= 0;
             return (
              <div 
                key={product._id} 
                onClick={() => !isOutOfStock && addToCart(product)}
                style={{ 
                  padding: '1rem', 
                  backgroundColor: isOutOfStock ? 'rgba(0,0,0,0.05)' : 'var(--bg-secondary)', 
                  border: isOutOfStock ? '1px dashed var(--border-color)' : '1px solid var(--border-color)',
                  borderTop: isOutOfStock ? '' : '4px solid var(--accent-color)',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  opacity: isOutOfStock ? 0.5 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '140px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: '0.25rem' }}>{product.barcode}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.2 }}>{product.name}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Stock: {product.stock}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success-color)' }}>${product.price.toFixed(2)}</div>
                </div>
              </div>
             );
          })}
        </div>
      </div>

      {/* RIGHT PANEL - CART */}
      <div style={{ flex: 1, minWidth: '350px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', height: '100%' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--accent-color)', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingCart size={20} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>CARRITO ACTUAL</h2>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '3rem' }}>
              El carrito está vacío. Escanea o selecciona un producto.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {item.quantity} x ${item.product.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>${item.subtotal.toFixed(2)}</div>
                    <button 
                      onClick={() => removeFromCart(item.product._id)}
                      style={{ padding: '0.25rem', backgroundColor: 'transparent', color: 'var(--danger-color)', border: 'none' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CART TOTAL & BUTTON */}
        <div style={{ borderTop: '2px solid var(--border-color)', padding: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>TOTAL A COBRAR</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success-color)', lineHeight: 1 }}>
              ${total.toFixed(2)}
            </span>
          </div>

          {successMsg && (
            <div style={{ backgroundColor: 'var(--success-color)', color: 'white', padding: '1rem', textAlign: 'center', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <CheckCircle size={20} />
              {successMsg}
            </div>
          )}

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            style={{ 
              width: '100%', 
              padding: '1.5rem', 
              fontSize: '1.25rem', 
              fontWeight: '900', 
              letterSpacing: '2px',
              backgroundColor: cart.length === 0 ? 'var(--border-color)' : 'var(--accent-color)',
              color: cart.length === 0 ? 'var(--text-secondary)' : 'var(--bg-primary)',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'PROCESANDO...' : 'REGISTRAR VENTA'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default POS;
