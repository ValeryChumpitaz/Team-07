// models/producto.model.ts
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  activo: boolean;
  codigo?: string; // Agregar campo opcional para el código
}