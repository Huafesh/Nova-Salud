import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, onSave, onDelete, productToEdit }) => {
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    description: '',
    category: 'General',
    price: '',
    stock: '',
    minStockAlert: '5'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        barcode: productToEdit.barcode || '',
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        category: productToEdit.category || 'General',
        price: productToEdit.price || '',
        stock: productToEdit.stock !== undefined ? productToEdit.stock : '',
        minStockAlert: productToEdit.minStockAlert !== undefined ? productToEdit.minStockAlert : '5'
      });
    } else {
      setFormData({
        barcode: '',
        name: '',
        description: '',
        category: 'General',
        price: '',
        stock: '',
        minStockAlert: '5'
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Basic validation
      if (!formData.name || !formData.barcode || !formData.price || !formData.stock) {
        throw new Error('Todos los campos marcados con * son obligatorios');
      }

      await onSave({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minStockAlert: parseInt(formData.minStockAlert)
      });
      // The parent component handles closing the modal and resetting state
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas ELIMINAR este producto definitivamente? Esta acción no se puede deshacer.')) {
      setLoading(true);
      try {
        await onDelete(productToEdit._id);
        // Parent will close modal
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error al eliminar el producto');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        padding: '2rem',
        boxShadow: 'none',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            padding: '0.25rem'
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          {productToEdit ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
        </h2>

        {error && (
          <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>CÓDIGO DE BARRAS *</label>
              <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} style={{ width: '100%' }} required autoFocus />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>CATEGORÍA *</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} style={{ width: '100%' }} required />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>NOMBRE DEL PRODUCTO *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%' }} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>DESCRIPCIÓN</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="2"
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>PRECIO ($) *</label>
              <input type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} style={{ width: '100%' }} required />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>STOCK INICIAL *</label>
              <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} style={{ width: '100%' }} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>ALERTA MIN.</label>
              <input type="number" min="0" name="minStockAlert" value={formData.minStockAlert} onChange={handleChange} style={{ width: '100%' }} required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {productToEdit && onDelete && (
              <button 
                type="button" 
                onClick={handleDelete}
                disabled={loading}
                style={{ backgroundColor: 'transparent', color: 'var(--danger-color)', border: '1px solid var(--danger-color)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Eliminar Producto"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              CANCELAR
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{ flex: 2, backgroundColor: 'var(--success-color)', color: 'white', border: 'none', fontWeight: 'bold' }}
            >
              {loading ? 'PROCESANDO...' : (productToEdit ? 'ACTUALIZAR PRODUCTO' : 'GUARDAR PRODUCTO')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductModal;
