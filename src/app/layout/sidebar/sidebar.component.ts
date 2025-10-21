import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() collapsed: boolean = false;

  // Menú de navegación
  menuItems = [
    { 
      path: '/ordenes', 
      icon: '🏠', 
      label: 'Inicio', 
      active: false 
    },
    { 
      path: '/ordenes', 
      icon: '📋', 
      label: 'Órdenes', 
      active: false 
    },
    { 
      path: '/mesas', 
      icon: '🪑', 
      label: 'Mesas', 
      active: false 
    },
    { 
      path: '/personal', 
      icon: '👨‍🍳', 
      label: 'Personal', 
      active: false 
    },
    { 
      path: '/clientes', 
      icon: '👥', 
      label: 'Clientes', 
      active: false 
    },
    { 
      path: '/productos', 
      icon: '🍽️', 
      label: 'Productos', 
      active: true 
    }
  ];

  // Información del usuario
  userInfo = {
    name: 'Administrador',
    role: 'Administrador',
    avatar: '👤'
  };

  // Método para manejar el click en un item del menú
  onMenuItemClick(clickedItem: any) {
    this.menuItems.forEach(item => {
      item.active = item.label === clickedItem.label;
    });
  }

  // Método para obtener la clase CSS del item del menú
  getMenuItemClass(item: any): string {
    return item.active ? 'nav-item active' : 'nav-item';
  }
}