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
      },
      error: (error) => {
        console.error('❌ Error cargando productos:', error);
        alert('Error al cargar productos');
      }
    });
  }

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

          // ✅ ACTUALIZAR ESTADO LOCALMENTE sin recargar
          const productoIndex = this.productos.findIndex(p => p.id === id);
          if (productoIndex !== -1) {
            this.productos[productoIndex].activo = false;
            console.log('🔄 Estado actualizado localmente - Producto ahora INACTIVO');
          }

          alert(response.message || 'Producto eliminado correctamente');
        },
        error: (error) => {
          console.error('❌ List: Error en eliminación:', error);
          alert('Error al eliminar producto: ' + (error.error?.message || error.message));

          // ❌ Si hay error, recargar la lista completa
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

        // ✅ ACTUALIZAR ESTADO LOCALMENTE sin recargar
        const productoIndex = this.productos.findIndex(p => p.id === id);
        if (productoIndex !== -1) {
          this.productos[productoIndex].activo = true;
          console.log('🔄 Estado actualizado localmente - Producto ahora ACTIVO');
        }

        alert(response.message || 'Producto restaurado correctamente');
      },
      error: (error) => {
        console.error('❌ List: Error en restauración:', error);
        alert('Error al restaurar producto: ' + (error.error?.message || error.message));

        // ❌ Si hay error, recargar la lista completa
        this.loadProductos();
      }
    });
  }
}