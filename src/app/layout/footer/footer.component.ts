import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  
  currentYear: number = new Date().getFullYear();
  
  // Información del restaurante
  restaurantInfo = {
    name: 'La Sazón de Panchita',
    address: 'Av. Principal 123, Ciudad',
    phone: '+1 (555) 123-4567',
    email: 'contacto@lasazondepanchita.com',
    schedule: 'Lun-Dom: 8:00 AM - 10:00 PM'
  };

  // Enlaces rápidos
  quickLinks = [
    { name: 'Sobre Nosotros', url: '#' },
    { name: 'Nuestro Menú', url: '#' },
    { name: 'Reservaciones', url: '#' },
    { name: 'Trabaja con Nosotros', url: '#' },
    { name: 'Términos y Condiciones', url: '#' }
  ];

  // Información de contacto
  contactInfo = [
    { icon: '📞', text: 'Reservaciones: +1 (555) 123-4567' },
    { icon: '📧', text: 'contacto@lasazondepanchita.com' },
    { icon: '📍', text: 'Av. Principal 123, Ciudad' }
  ];

  // Redes sociales
  socialLinks = [
    { icon: '📘', name: 'Facebook', url: '#' },
    { icon: '📷', name: 'Instagram', url: '#' },
    { icon: '🐦', name: 'Twitter', url: '#' },
    { icon: '💬', name: 'WhatsApp', url: '#' }
  ];

  // Enlaces del footer bottom
  bottomLinks = [
    { name: 'Política de Privacidad', url: '#' },
    { name: 'Términos de Servicio', url: '#' },
    { name: 'Mapa del Sitio', url: '#' }
  ];

  // Función para suscribirse al newsletter
  subscribeToNewsletter(email: string): void {
    if (email && this.isValidEmail(email)) {
      console.log('Suscripción exitosa para:', email);
      // Aquí iría la lógica para enviar el email al servidor
      alert(`¡Gracias por suscribirte con: ${email}`);
      
      // Limpiar el input
      const input = document.querySelector('.newsletter-input') as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    } else {
      alert('Por favor, ingresa un email válido');
    }
  }

  // Validación simple de email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función para manejar el clic en el botón de suscripción
  onSubscribeClick(): void {
    const input = document.querySelector('.newsletter-input') as HTMLInputElement;
    if (input) {
      this.subscribeToNewsletter(input.value);
    }
  }

  // Función para manejar la tecla Enter en el input
  onNewsletterKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubscribeClick();
    }
  }
}