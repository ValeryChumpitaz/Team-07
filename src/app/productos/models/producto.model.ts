// models/producto.model.ts
export interface Product {
  id: number;
  name: string; // Cambiado de 'nombre'
  description: string; // Cambiado de 'descripcion'
  price: number; // Cambiado de 'precio'
  category: string; // Cambiado de 'categoria'
  active: boolean; // Cambiado de 'activo'
  productCode?: string; // Cambiado de 'codigo'
}