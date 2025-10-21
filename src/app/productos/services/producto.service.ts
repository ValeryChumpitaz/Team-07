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
        name: product.name, // Cambiado
        description: product.description || '', // Cambiado
        price: product.price, // Cambiado
        category: product.category, // Cambiado
        active: product.status === 'ACTIVO', // Cambiado
        productCode: product.productCode // Cambiado
      })))
    );
  }

  // ✅ CREAR
  createProduct(productData: any): Observable<any> {
    const dataToSend = {
      name: productData.name, // Cambiado
      description: productData.description, // Cambiado
      price: productData.price, // Cambiado
      category: productData.category // Cambiado
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
      productCode: productData.productCode || `PROD${id.toString().padStart(3, '0')}`, // Cambiado
      name: productData.name, // Cambiado
      description: productData.description, // Cambiado
      price: productData.price, // Cambiado
      category: productData.category, // Cambiado
      status: productData.active ? 'ACTIVO' : 'INACTIVO' // Cambiado
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
        name: product.name, // Cambiado
        description: product.description || '', // Cambiado
        price: product.price, // Cambiado
        category: product.category, // Cambiado
        active: product.status === 'ACTIVO', // Cambiado
        productCode: product.productCode // Cambiado
      }))
    );
  }

  // 🧪 MÉTODO PARA LIMPIAR PRODUCTOS TEMPORALES (OPCIONAL)
  limpiarProductosTemporales(): Observable<any> {
    console.log('🧹 Service: Buscando productos temporales para limpiar...');
    
    return this.getProductos().pipe(
      map(productos => {
        const productosTemporales = productos.filter(p => 
          p.productCode?.includes('TEMP') || 
          p.name?.includes('Test') ||
          p.name?.includes('TEST') ||
          p.name?.includes('Prueba')
        );
        
        console.log('🗑️ Productos temporales encontrados:', productosTemporales.length);
        return productosTemporales;
      })
    );
  }
}