import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Product } from '../models/producto.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8081/api/productos'; 

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // ✅ LISTAR
  getProductos(): Observable<Product[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(products => products.map(product => ({
        id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        precio: product.precio,
        categoria: product.categoria,
        activo: product.estado === 'ACTIVO',
        codigo: product.codigoProducto
      })))
    );
  }

  // ✅ CREAR
  createProduct(productData: any): Observable<any> {
    const dataToSend = {
      nombre: productData.nombre,
      descripcion: productData.descripcion,
      precio: productData.precio,
      categoria: productData.categoria
    };

    console.log('🚀 CREAR - Enviando:', dataToSend);

    return this.http.post(this.baseUrl, dataToSend, this.httpOptions).pipe(
      map(response => response),
      catchError(error => {
        console.error('❌ Error creando producto:', error);
        return throwError(() => error);
      })
    );
  }

  // ✅ EDITAR
  updateProduct(id: number, productData: any): Observable<any> {
    const dataToSend = {
      codigoProducto: productData.codigo || `PROD${id.toString().padStart(3, '0')}`,
      nombre: productData.nombre,
      descripcion: productData.descripcion,
      precio: productData.precio,
      categoria: productData.categoria,
      estado: productData.activo ? 'ACTIVO' : 'INACTIVO'
    };

    console.log('✏️ EDITAR - Enviando:', dataToSend);

    return this.http.put(`${this.baseUrl}/${id}`, dataToSend, this.httpOptions).pipe(
      map(response => response),
      catchError(error => {
        console.error('❌ Error actualizando producto:', error);
        return throwError(() => error);
      })
    );
  }

  // ✅ ELIMINAR - CORREGIDO para usar responseType: 'text'
  deleteProduct(id: number): Observable<any> {
    console.log('🗑️ Service: Eliminando producto ID:', id);
    
    return this.http.patch(`${this.baseUrl}/${id}/eliminar`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    }).pipe(
      map((response: string) => {
        console.log('✅ Service: Eliminación EXITOSA - Respuesta:', response);
        return { success: true, message: response || 'Producto eliminado correctamente' };
      }),
      catchError(error => {
        console.error('❌ Service: Error en eliminación:', error);
        return throwError(() => error);
      })
    );
  }

  // ✅ RESTAURAR - CORREGIDO para usar responseType: 'text'
  restoreProduct(id: number): Observable<any> {
    console.log('🔄 Service: Restaurando producto ID:', id);
    
    return this.http.patch(`${this.baseUrl}/${id}/restaurar`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    }).pipe(
      map((response: string) => {
        console.log('✅ Service: Restauración EXITOSA - Respuesta:', response);
        return { success: true, message: response || 'Producto restaurado correctamente' };
      }),
      catchError(error => {
        console.error('❌ Service: Error en restauración:', error);
        return throwError(() => error);
      })
    );
  }

  // ✅ OBTENER por ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(product => ({
        id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        precio: product.precio,
        categoria: product.categoria,
        activo: product.estado === 'ACTIVO',
        codigo: product.codigoProducto
      }))
    );
  }

  // 🧪 MÉTODO PARA LIMPIAR PRODUCTOS TEMPORALES (OPCIONAL)
  limpiarProductosTemporales(): Observable<any> {
    console.log('🧹 Service: Buscando productos temporales para limpiar...');
    
    return this.getProductos().pipe(
      map(productos => {
        const productosTemporales = productos.filter(p => 
          p.codigo?.includes('TEMP') || 
          p.nombre?.includes('Test') ||
          p.nombre?.includes('TEST') ||
          p.nombre?.includes('Prueba')
        );
        
        console.log('🗑️ Productos temporales encontrados:', productosTemporales.length);
        return productosTemporales;
      })
    );
  }
}