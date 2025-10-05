import { Component, ViewChild, OnInit } from '@angular/core';
import { Product } from './productos/models/producto.model';
import { ListComponent } from './productos/list/list.component';
import { FormComponent } from './productos/form/form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ProductService } from './productos/services/producto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true, 
  imports: [
    ListComponent, 
    FormComponent, 
    CommonModule,  
    FormsModule,   
  ]
})
export class AppComponent implements OnInit {
  title = 'tienda-de-productos';
  selectedProduct: Product | null = null;
  isEditing = false;

  @ViewChild(ListComponent) productList!: ListComponent;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log('🔄 AppComponent iniciado');
    // ✅ SOLO iniciar la aplicación, NO ejecutar diagnóstico
  }

  onEditProduct(product: Product): void { 
    console.log('🔄 App: Producto recibido para editar:', product);
    this.selectedProduct = { ...product };
    this.isEditing = true;
  }

  onProductSaved(): void {
    console.log('💾 App: Producto guardado');
    this.selectedProduct = null;
    this.isEditing = false;
    if (this.productList) {
      this.productList.loadProductos();
    }
  }

  onCancelForm(): void {
    console.log('❌ App: Edición cancelada');
    this.selectedProduct = null;
    this.isEditing = false;
  }

  onShowForm(): void {
    console.log('🆕 App: Mostrando formulario para nuevo producto');
    this.selectedProduct = null;
    this.isEditing = false;
  }

  onRefreshList(): void {
    console.log('🔄 App: Refrescando lista');
    if (this.productList) {
      this.productList.loadProductos();
    }
  }

  // Método para debuggear el estado actual
  debugAppState(): void {
    console.log('🐛 DEBUG App State:');
    console.log('selectedProduct:', this.selectedProduct);
    console.log('isEditing:', this.isEditing);
    console.log('productList available:', !!this.productList);
  }
}