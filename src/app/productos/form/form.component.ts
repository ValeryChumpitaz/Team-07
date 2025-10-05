import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Product } from '../models/producto.model';
import { ProductService } from '../services/producto.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnChanges, OnInit {
  @Input() productToEdit: Product | null = null;
  @Output() productSaved = new EventEmitter<void>();
  @Output() cancelForm = new EventEmitter<void>();

  product: Product = this.getEmptyProduct();
  
  isEditMode = false;
  isSubmitting = false;
  categorias: string[] = ['ENTRADA', 'PLATO_FUERTE', 'BEBIDA', 'POSTRE'];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log('📝 FormComponent inicializado');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('📝 FormComponent: ngOnChanges ejecutado', changes);
    
    if (changes['productToEdit'] && changes['productToEdit'].currentValue !== changes['productToEdit'].previousValue) {
      this.handleProductToEditChange(changes['productToEdit'].currentValue);
    }
  }

  private handleProductToEditChange(currentProduct: Product | null): void {
    console.log('📝 Producto recibido:', currentProduct);
    
    if (currentProduct) {
      this.loadProductForEditing(currentProduct);
    } else {
      this.resetToCreateMode();
    }
  }

  private loadProductForEditing(product: Product): void {
    this.isEditMode = true;
    this.product = { 
      ...product
    };
    console.log('✅ Formulario cargado en modo EDICIÓN:', this.product);
  }

  private resetToCreateMode(): void {
    this.isEditMode = false;
    this.resetForm();
    console.log('📝 Modo CREACIÓN activado');
  }

  saveProduct(): void {
    if (this.isSubmitting) {
      return;
    }

    console.log('💾 GUARDAR clickeado - Datos actuales:', this.product);
    
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;
    console.log('📤 Enviando datos al servicio...');
    
    if (this.isEditMode) {
      this.updateExistingProduct();
    } else {
      this.createNewProduct();
    }
  }

  private isFormValid(): boolean {
    if (!this.product.nombre?.trim()) {
      alert('Por favor ingresa el nombre del plato');
      return false;
    }
    
    if (!this.product.descripcion?.trim()) {
      alert('Por favor ingresa la descripción');
      return false;
    }
    
    if (!this.product.categoria) {
      alert('Por favor selecciona una categoría');
      return false;
    }
    
    if (!this.product.precio || this.product.precio <= 0) {
      alert('Por favor ingresa un precio válido mayor a 0');
      return false;
    }

    return true;
  }

  private updateExistingProduct(): void {
    console.log('✏️ Actualizando producto existente ID:', this.product.id);
    
    // ✅ CORREGIDO: Crear el objeto exactamente como lo espera el backend
    const productData = {
      id: this.product.id, // Asegurar que el ID está incluido
      nombre: this.product.nombre.trim(),
      descripcion: this.product.descripcion.trim(),
      precio: Number(this.product.precio), // Asegurar que es número
      categoria: this.product.categoria,
      activo: this.product.activo !== false,
      // Si el backend espera código, usar el existente o generar uno
      codigo: this.product.codigo || `PROD${this.product.id.toString().padStart(3, '0')}`
    };

    console.log('📦 Datos a enviar al servidor:', productData);

    this.productService.updateProduct(this.product.id, productData).subscribe({
      next: (response) => {
        console.log('✅ Producto actualizado exitosamente:', response);
        this.handleSuccess('✅ Producto actualizado exitosamente');
      },
      error: (error) => {
        this.handleError('❌ Error al actualizar el producto:', error);
      }
    });
  }

  private createNewProduct(): void {
    console.log('➕ Creando nuevo producto...');
    
    // ✅ CORREGIDO: Estructura exacta para creación
    const newProduct = { 
      nombre: this.product.nombre.trim(), 
      descripcion: this.product.descripcion.trim(), 
      precio: Number(this.product.precio), // Asegurar que es número
      categoria: this.product.categoria,
      activo: true // Por defecto activo al crear
    }; 
    
    console.log('📦 Datos a enviar al servidor (creación):', newProduct);

    this.productService.createProduct(newProduct).subscribe({
      next: (response) => {
        console.log('✅ Producto creado exitosamente:', response);
        this.handleSuccess('✅ Producto creado exitosamente');
      },
      error: (error) => {
        this.handleError('❌ Error al crear el producto:', error);
      }
    });
  }

  private handleSuccess(message: string): void {
    alert(message);
    this.productSaved.emit();
    this.resetForm();
    this.isSubmitting = false;
  }

  private handleError(errorMessage: string, error: any): void {
    console.error(errorMessage, error);
    
    // ✅ MEJORADO: Mostrar más detalles del error 400
    let errorDetail = 'Error desconocido';
    
    if (error.error) {
      // Si el backend envía un objeto de error con detalles
      if (typeof error.error === 'string') {
        errorDetail = error.error;
      } else if (error.error.message) {
        errorDetail = error.error.message;
      } else if (error.error.error) {
        errorDetail = error.error.error;
      } else {
        // Mostrar todo el objeto de error para debugging
        errorDetail = JSON.stringify(error.error);
      }
    } else if (error.message) {
      errorDetail = error.message;
    }
    
    alert(`${errorMessage}\n\nDetalles: ${errorDetail}`);
    this.isSubmitting = false;
  }

  onCancel(): void {
    console.log('❌ CANCELAR clickeado');
    this.cancelForm.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.product = this.getEmptyProduct();
    this.isEditMode = false;
    this.isSubmitting = false;
    console.log('🔄 Formulario reseteado');
  }

  private getEmptyProduct(): Product {
    return { 
      id: 0, 
      nombre: '', 
      descripcion: '', 
      precio: 0, 
      categoria: '', 
      activo: true 
    };
  }

  // Método para debuggear el estado actual
  debugState(): void {
    console.log('🐛 DEBUG Estado actual:');
    console.log('isEditMode:', this.isEditMode);
    console.log('isSubmitting:', this.isSubmitting);
    console.log('product:', this.product);
    console.log('productToEdit:', this.productToEdit);
  }
}