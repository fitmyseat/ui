import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService, Sale } from '../../core/services/sales';
import { ProductService, Product } from '../../core/services/product';
import { VehicleChart } from '../vehicle-chart/vehicle-chart';
import { PartyChart } from '../party-chart/party-chart';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, VehicleChart, PartyChart],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {
  private salesService = inject(SalesService);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  startDate: string = '';
  endDate: string = '';
  loading = false;
  error: string | null = null;
  showForm = false;
  editingSale: Sale | null = null;
  saleForm: FormGroup;

  constructor() {
    this.saleForm = this.fb.group({
      party_name: ['', Validators.required],
      vehicle_name: ['', Validators.required],
      model: [''],
      color: [''],
      stitch: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit_price: [0, [Validators.required, Validators.min(0)]],
      total_price: [0, [Validators.required, Validators.min(0)]],
      payment_mode: ['', Validators.required],
      mobile_number: [''],
      address: [''],
      remarks: [''],
      product_id: [null]
    });
  }

  ngOnInit() {
    // Set default date filter values
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    this.startDate = firstDayOfMonth.toISOString().split('T')[0];
    this.endDate = now.toISOString().split('T')[0];
    
    this.loadSales();
    
    // Check if navigation state contains product data from home page
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['product']) {
      const product: Product = navigation.extras.state['product'];
      this.prefillSaleFormFromProduct(product);
    }
  }

  prefillSaleFormFromProduct(product: Product) {
    this.saleForm.patchValue({
      vehicle_name: product.vehicle_name,
      model: product.model || '',
      color: product.color || '',
      stitch: product.stitch || '',
      unit_price: product.price || 0,
      quantity: 1,
      total_price: product.price || 0,
      product_id: product.id
    });
    this.showForm = true;
  }

  loadSales() {
    this.loading = true;
    this.error = null;
    console.log('Loading sales...');
    this.salesService.getSales().subscribe({
      next: (data) => {
        console.log('Sales received:', data);
        this.sales = data;
        this.filteredSales = data; // Initially show all sales
        this.loading = false;
        console.log('Loading completed, showing all sales');
        
        // Apply date filter after a short delay to ensure rendering
        setTimeout(() => {
          if (this.startDate && this.endDate) {
            console.log('Applying date filter:', this.startDate, 'to', this.endDate);
            this.filteredSales = this.filterSalesByDateRange(this.sales, this.startDate, this.endDate);
            console.log('Filtered sales count:', this.filteredSales.length);
          }
        }, 100);
      },
      error: (err) => {
        console.error('Error loading sales:', err);
        this.error = 'Error loading sales. Please try again.';
        this.filteredSales = [];
        this.loading = false;
      }
    });
  }

  filterSalesByDateRange(sales: Sale[], startDate: string, endDate: string): Sale[] {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date

      return sales.filter(sale => {
        if (!sale.sale_date) return false;
        const saleDate = new Date(sale.sale_date);
        return saleDate >= start && saleDate <= end;
      });
    } catch (err) {
      console.error('Error in date filtering:', err);
      return sales; // Return all sales if filtering fails
    }
  }

  filterByDateRange() {
    if (this.startDate && this.endDate) {
      this.loading = true;
      this.filteredSales = this.filterSalesByDateRange(this.sales, this.startDate, this.endDate);
      this.loading = false;
    } else {
      this.filteredSales = this.sales;
    }
  }

  clearFilter() {
    this.startDate = '';
    this.endDate = '';
    this.filteredSales = this.sales;
  }

  deleteSale(id: number) {
    if (confirm('Are you sure you want to delete this sale?')) {
      this.salesService.deleteSale(id).subscribe({
        next: () => {
          console.log('Sale deleted successfully');
          this.loadSales();
        },
        error: (err) => {
          console.error('Error deleting sale:', err);
          alert('Error deleting sale. Please try again.');
        }
      });
    }
  }

  openAddForm() {
    this.editingSale = null;
    this.saleForm.reset({
      party_name: '',
      vehicle_name: '',
      model: '',
      color: '',
      stitch: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      payment_mode: '',
      mobile_number: '',
      address: '',
      remarks: '',
      product_id: null
    });
    this.showForm = true;
  }

  editSale(sale: Sale) {
    this.editingSale = sale;
    this.saleForm.patchValue(sale);
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingSale = null;
    this.saleForm.reset();
  }

  saveSale() {
    if (this.saleForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    const saleData: Sale = this.saleForm.value;

    if (this.editingSale?.id) {
      this.salesService.updateSale(this.editingSale.id, saleData).subscribe({
        next: () => {
          console.log('Sale updated successfully');
          this.loadSales();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Error updating sale:', err);
          alert('Error updating sale. Please try again.');
        }
      });
    } else {
      this.salesService.createSale(saleData).subscribe({
        next: () => {
          console.log('Sale created successfully');
          
          // Decrement product quantity if product_id is provided
          if (saleData.product_id) {
            this.productService.decrementQuantity(saleData.product_id).subscribe({
              next: () => {
                console.log('Product quantity decremented successfully');
              },
              error: (err) => {
                console.error('Error decrementing product quantity:', err);
                // Continue even if decrement fails
              }
            });
          }
          
          this.loadSales();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Error creating sale:', err);
          alert('Error creating sale. Please try again.');
        }
      });
    }
  }

  calculateTotalPrice() {
    const quantity = this.saleForm.get('quantity')?.value || 0;
    const unitPrice = this.saleForm.get('unit_price')?.value || 0;
    this.saleForm.patchValue({ total_price: quantity * unitPrice });
  }
}
