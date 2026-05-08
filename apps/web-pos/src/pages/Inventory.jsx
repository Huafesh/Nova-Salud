import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductModal from '../components/ProductModal';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      const response = await axios.post('/products', productData);
      setProducts([...products, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Buscar por código o nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            NUEVO PRODUCTO
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '150px' }}>CÓDIGO</th>
                <th>NOMBRE / DESCRIPCIÓN</th>
                <th style={{ width: '150px' }}>CATEGORÍA</th>
                <th style={{ width: '100px', textAlign: 'right' }}>PRECIO ($)</th>
                <th style={{ width: '100px', textAlign: 'right' }}>STOCK</th>
                {user?.role === 'admin' && <th style={{ width: '100px', textAlign: 'center' }}>ACCIONES</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const isCritical = product.stock <= product.minStockAlert;
                return (
                  <tr key={product._id} className={isCritical ? 'critical-stock' : ''}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{product.barcode}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{product.name}</div>
                      {isCritical && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 'bold' }}>
                          <AlertTriangle size={12} /> ALERTA DE STOCK ({product.minStockAlert})
                        </div>
                      )}
                    </td>
                    <td>{product.category}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{product.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>{product.stock}</td>
                    {user?.role === 'admin' && (
                      <td style={{ textAlign: 'center' }}>
                        <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: isCritical ? 'rgba(0,0,0,0.3)' : 'var(--bg-primary)', color: isCritical ? '#fff' : 'var(--text-primary)', border: isCritical ? '1px solid rgba(255,255,255,0.5)' : '1px solid var(--border-color)' }}>
                          EDITAR
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 6 : 5} style={{ textAlign: 'center', padding: '2rem' }}>
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct} 
      />
    </div>
  );
};

export default Inventory;
