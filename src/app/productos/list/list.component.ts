import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../services/producto.service';
import { Product } from '../models/producto.model';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: true,
  imports: [CommonModule, DecimalPipe]
})
export class ListComponent implements OnInit {
  productos: Product[] = [];
  productosActivos: Product[] = []; // ← NUEVA variable para solo activos
  productosInactivos: Product[] = [];
  mostrarModalInactivos: boolean = false;

  @Output() editProduct = new EventEmitter<Product>();
  @Output() refreshList = new EventEmitter<void>();

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    console.log('🔄 ListComponent iniciado');
    this.loadProductos();
  }

  loadProductos(): void {
    console.log('📥 Cargando productos...');
    this.productService.getProductos().subscribe({
      next: (data) => {
        console.log('✅ Productos cargados:', data);
        this.productos = data;
        // ↓↓↓ FILTRAR ACTIVOS E INACTIVOS ↓↓↓
        this.productosActivos = data.filter(p => p.active); // Cambiado
        this.productosInactivos = data.filter(p => !p.active); // Cambiado
      },
      error: (error) => {
        console.error('❌ Error cargando productos:', error);
        alert('Error al cargar productos');
      }
    });
  }

  // ↓↓↓ NUEVOS MÉTODOS PARA EL MODAL ↓↓↓
  abrirModalInactivos(): void {
    this.mostrarModalInactivos = true;
  }

  cerrarModalInactivos(): void {
    this.mostrarModalInactivos = false;
  }

  onRestoreFromModal(id: number): void {
    console.log('🔄 Restaurando desde modal, ID:', id);
    
    this.productService.restoreProduct(id).subscribe({
      next: (response: any) => {
        console.log('✅ Producto restaurado desde modal');
        
        // ✅ ACTUALIZAR LISTAS LOCALES
        const productoIndex = this.productos.findIndex(p => p.id === id);
        if (productoIndex !== -1) {
          this.productos[productoIndex].active = true; // Cambiado
          // Quitar de inactivos y agregar a activos
          const productoRestaurado = this.productosInactivos.find(p => p.id === id);
          this.productosInactivos = this.productosInactivos.filter(p => p.id !== id);
          if (productoRestaurado) {
            this.productosActivos.push({...productoRestaurado, active: true}); // Cambiado
          }
        }
        
        alert(response.message || 'Producto restaurado correctamente');
        
        // Cerrar modal si no hay más inactivos
        if (this.productosInactivos.length === 0) {
          this.cerrarModalInactivos();
        }
      },
      error: (error) => {
        console.error('❌ Error restaurando desde modal:', error);
        alert('Error al restaurar producto: ' + (error.error?.message || error.message));
        this.loadProductos();
      }
    });
  }
  // ↑↑↑ FIN NUEVOS MÉTODOS ↑↑↑

  onEdit(producto: Product) {
    console.log('✏️ Editando producto:', producto);

    if (!producto.id) {
      console.error('❌ Producto sin ID');
      alert('Error: Producto sin ID');
      return;
    }

    this.editProduct.emit(producto);
  }

  onDelete(id: number): void {
    console.log('🗑️ List: Intentando ELIMINAR producto ID:', id);

    if (confirm('¿Estás seguro de que quieres dar de baja este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (response: any) => {
          console.log('✅ List: Eliminación COMPLETADA');

          // ✅ ACTUALIZAR LISTAS LOCALES
          const productoIndex = this.productos.findIndex(p => p.id === id);
          if (productoIndex !== -1) {
            this.productos[productoIndex].active = false; // Cambiado
            // Quitar de activos y agregar a inactivos
            const productoEliminado = this.productosActivos.find(p => p.id === id);
            this.productosActivos = this.productosActivos.filter(p => p.id !== id);
            if (productoEliminado) {
              this.productosInactivos.push({...productoEliminado, active: false}); // Cambiado
            }
          }

          alert(response.message || 'Producto eliminado correctamente');
        },
        error: (error) => {
          console.error('❌ List: Error en eliminación:', error);
          alert('Error al eliminar producto: ' + (error.error?.message || error.message));
          this.loadProductos();
        }
      });
    }
  }

  onRestore(id: number): void {
    console.log('🔄 List: Intentando RESTAURAR producto ID:', id);

    this.productService.restoreProduct(id).subscribe({
      next: (response: any) => {
        console.log('✅ List: Restauración COMPLETADA');

        // ✅ ACTUALIZAR LISTAS LOCALES
        const productoIndex = this.productos.findIndex(p => p.id === id);
        if (productoIndex !== -1) {
          this.productos[productoIndex].active = true; // Cambiado
          // Quitar de inactivos y agregar a activos
          const productoRestaurado = this.productosInactivos.find(p => p.id === id);
          this.productosInactivos = this.productosInactivos.filter(p => p.id !== id);
          if (productoRestaurado) {
            this.productosActivos.push({...productoRestaurado, active: true}); // Cambiado
          }
        }

        alert(response.message || 'Producto restaurado correctamente');
      },
      error: (error) => {
        console.error('❌ List: Error en restauración:', error);
        alert('Error al restaurar producto: ' + (error.error?.message || error.message));
        this.loadProductos();
      }
    });
  }
}