// src/components/modals/PuestoForm.jsx
import React, { useState, useEffect } from 'react';
import './PuestoForm.css';

const CATEGORIAS = [
  'Comida',
  'Bebidas',
  'Ropa',
  'Accesorios',
  'Artesanías',
  'Electrónica',
  'Juguetes',
  'Libros',
  'Plantas',
  'Otros'
];

export const PuestoForm = ({ puesto, onSubmit, onCancel, loading, isEditing = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    categoria: '',
    nombre_puesto: '',
    descripcion_negocio: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && puesto?.cliente) {
      setFormData({
        nombre: puesto.cliente.nombre || '',
        telefono: puesto.cliente.telefono || '',
        categoria: puesto.cliente.categoria || '',
        nombre_puesto: puesto.cliente.nombre_puesto || '',
        descripcion_negocio: puesto.cliente.descripcion_negocio || '',
      });
    }
  }, [puesto, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{7,}$/.test(formData.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (mínimo 7 dígitos)';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Selecciona una categoría';
    }

    if (!formData.nombre_puesto.trim()) {
      newErrors.nombre_puesto = 'El nombre del puesto es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handlePhoneChange = (e) => {
    // Permitir solo números
    const value = e.target.value.replace(/\D/g, '');
    
    // Formatear teléfono: (123) 456-7890
    let formatted = value;
    if (value.length >= 6) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }

    setFormData(prev => ({
      ...prev,
      telefono: formatted
    }));
  };

  return (
    <form className="puesto-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Vendedor *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez"
          className={errors.nombre ? 'input-error' : ''}
          disabled={loading}
        />
        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="telefono">Teléfono *</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handlePhoneChange}
          placeholder="(123) 456-7890"
          className={errors.telefono ? 'input-error' : ''}
          disabled={loading}
        />
        {errors.telefono && <span className="error-message">{errors.telefono}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="categoria">Categoría *</label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className={errors.categoria ? 'input-error' : ''}
          disabled={loading}
        >
          <option value="">-- Selecciona una categoría --</option>
          {CATEGORIAS.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.categoria && <span className="error-message">{errors.categoria}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="nombre_puesto">Nombre del Puesto *</label>
        <input
          type="text"
          id="nombre_puesto"
          name="nombre_puesto"
          value={formData.nombre_puesto}
          onChange={handleChange}
          placeholder="Ej: Tacos El Vilsito"
          className={errors.nombre_puesto ? 'input-error' : ''}
          disabled={loading}
        />
        {errors.nombre_puesto && <span className="error-message">{errors.nombre_puesto}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion_negocio">Descripción (Opcional)</label>
        <textarea
          id="descripcion_negocio"
          name="descripcion_negocio"
          value={formData.descripcion_negocio}
          onChange={handleChange}
          placeholder="Describe tu negocio brevemente..."
          rows="3"
          disabled={loading}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-cancel"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Registrar'}
        </button>
      </div>

      {/* Puesto Info */}
      <div className="puesto-info">
        <p><strong>Puesto #</strong> {puesto?.numero}</p>
        <p><strong>Estado:</strong> {puesto?.estado === 'ocupado' ? '✓ Ocupado' : '○ Libre'}</p>
      </div>
    </form>
  );
};
