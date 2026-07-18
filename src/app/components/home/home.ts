import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../core/services/product';
import { SalesService, Sale } from '../../core/services/sales';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private productService = inject(ProductService);
  private salesService = inject(SalesService);
  private router = inject(Router);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProductIds: number[] = [];
  showConfirmModal = false;
  selectedProduct: Product | null = null;
  showShareModal = false;
  mobileNumber: string = '';
  partyName: string = '';
  saleDate: string = new Date().toISOString().split('T')[0];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';

  ngOnInit() {
    this.loading = true;
    this.error = null;
    console.log('Loading products...');
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        console.log('Products loaded:', data);
        console.log('Setting products and clearing loading state');
        this.products = data;
        this.filteredProducts = data;
        // Force loading to false
        setTimeout(() => {
          this.loading = false;
          console.log('Loading state cleared. Loading:', this.loading, 'Products count:', this.products.length);
        }, 0);
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.error = 'Error loading products. Please try again.';
        this.loading = false;
      }
    });
  }

  filterProducts() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredProducts = this.products;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      (product.vehicle_name && product.vehicle_name.toLowerCase().includes(term)) ||
      (product.model && product.model.toLowerCase().includes(term)) ||
      (product.color && product.color.toLowerCase().includes(term)) ||
      (product.stitch && product.stitch.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredProducts = this.products;
  }

  toggleProductSelection(productId: number) {
    const index = this.selectedProductIds.indexOf(productId);
    if (index > -1) {
      this.selectedProductIds.splice(index, 1);
    } else {
      this.selectedProductIds.push(productId);
    }
  }

  isProductSelected(productId: number): boolean {
    return this.selectedProductIds.includes(productId);
  }

  selectAllProducts() {
    this.selectedProductIds = this.filteredProducts.map(p => p.id!);
  }

  deselectAllProducts() {
    this.selectedProductIds = [];
  }

  get selectedCount(): number {
    return this.selectedProductIds.length;
  }

  openShareModal() {
    this.showShareModal = true;
    this.mobileNumber = '';
  }

  closeShareModal() {
    this.showShareModal = false;
    this.mobileNumber = '';
  }

  shareViaWhatsApp() {
    if (!this.mobileNumber || this.selectedProductIds.length === 0) {
      return;
    }

    const selectedProducts = this.products.filter(p => this.selectedProductIds.includes(p.id!));
    
    // Create a message with product details
    let message = '🚗 *FitMySeat - Premium Car Seat Covers*\n\n';
    message += '*Selected Products:*\n\n';
    
    selectedProducts.forEach((product, index) => {
      message += `${index + 1}. ${product.vehicle_name}\n`;
      message += `   Model: ${product.model || 'Universal'}\n`;
      if (product.color) message += `   Color: ${product.color}\n`;
      if (product.stitch) message += `   Stitch: ${product.stitch}\n`;
      message += `   Price: ₹${product.price || 0}\n\n`;
    });

    message += `*Total Products: ${selectedProducts.length}*\n`;
    message += `*Total Value: ₹${selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0)}*`;

    // WhatsApp API URL
    const whatsappUrl = `https://wa.me/${this.mobileNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Close modal and deselect products
    this.closeShareModal();
    this.deselectAllProducts();
  }

  confirmSale(product: Product) {
    this.selectedProduct = product;
    this.showConfirmModal = true;
  }

  cancelSale() {
    this.showConfirmModal = false;
    this.selectedProduct = null;
    this.partyName = '';
    this.saleDate = new Date().toISOString().split('T')[0];
  }

  processSale() {
    if (this.selectedProduct && this.selectedProduct.id && this.selectedProduct.quantity > 0 && this.partyName) {
      const saleData: Sale = {
        party_name: this.partyName,
        vehicle_name: this.selectedProduct.vehicle_name,
        model: this.selectedProduct.model,
        color: this.selectedProduct.color,
        stitch: this.selectedProduct.stitch,
        quantity: 1,
        unit_price: this.selectedProduct.price || 0,
        total_price: this.selectedProduct.price || 0,
        payment_mode: 'Cash',
        sale_date: this.saleDate,
        product_id: this.selectedProduct.id
      };

      // Create sale record
      this.salesService.createSale(saleData).subscribe({
        next: () => {
          console.log('Sale created successfully');
          
          // Decrement product quantity
          this.productService.decrementQuantity(this.selectedProduct!.id!).subscribe({
            next: (updatedProduct) => {
              console.log('Product decremented successfully:', updatedProduct);
              // Update the local product with the returned data
              const index = this.products.findIndex(p => p.id === this.selectedProduct!.id);
              if (index !== -1) {
                this.products[index] = updatedProduct;
              }
              this.showConfirmModal = false;
              this.selectedProduct = null;
              this.partyName = '';
            },
            error: (err: any) => {
              console.error('Error decrementing product:', err);
              alert('Sale created but error updating product quantity.');
              this.showConfirmModal = false;
              this.selectedProduct = null;
              this.partyName = '';
            }
          });
        },
        error: (err: any) => {
          console.error('Error creating sale:', err);
          alert('Error processing sale. Please try again.');
        }
      });
    }
  }
}
