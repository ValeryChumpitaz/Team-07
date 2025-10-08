import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  // 🧩 Simulación de base de datos
  private customers: Customer[] = [
    {
      id: 1,
      nombre: 'Araceli',
      apellido: 'Chomado',
      email: 'araceli@ejemplo.com',
      telefono: '907019780',
      direccion: 'Av. Los Ángeles, Cañete',
      activo: true
    },
    {
      id: 2,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@ejemplo.com',
      telefono: '912345678',
      direccion: 'Calle Falsa 123',
      activo: true
    },
    {
      id: 3,
      nombre: 'María',
      apellido: 'López',
      email: 'maria@ejemplo.com',
      telefono: '987654321',
      direccion: 'Avenida Siempre Viva',
      activo: false // Cliente Inactivo de inicio
    }
  ];

  private nextId = 4;

  constructor() {
    console.log('✅ CustomerService en modo Simulación (datos en memoria)');
  }

  // 📖 LEE: Devuelve la lista en memoria
  getCustomers(): Observable<Customer[]> {
    return of(this.customers);
  }

  // 🆕 CREA: Añade un nuevo cliente
  createCustomer(customer: Customer): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: this.nextId++,
      activo: true
    };
    this.customers.push(newCustomer);
    return of(newCustomer);
  }

  // ✏️ ACTUALIZA: Reemplaza el objeto en la lista (editar/restaurar)
  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index > -1) {
      this.customers[index] = { ...customer, id };
    }
    return of(this.customers[index]);
  }

  // 🗑️ ELIMINA (suavemente): cambia activo a false
  deleteCustomer(id: number): Observable<void> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index > -1) {
      this.customers[index] = { ...this.customers[index], activo: false };
    }
    return of(undefined);
  }
}
