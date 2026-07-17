import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, Product } from '../../core/services/product';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-all-covers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './all-covers.html',
  styleUrl: './all-covers.css'
})
export class AllCovers {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private imageService = inject(ImageService);
  
  searchTerm = signal('');
  
  allCovers: Product[] = [];
  filteredCovers = signal<Product[]>([]);
  editingProduct: Product | null = null;
  isEditing = signal(false);
  productForm!: FormGroup;
  
  // Image upload properties
  selectedFile!: File;
  uploadingImage = signal(false);
  
  ngOnInit() {
    this.initForm();
    this.loadProducts();
  }

  initForm() {
    this.productForm = this.fb.group({
      vehicle_name: ['', Validators.required],
      model: [''],
      color: [''],
      price: [0],
      quantity: [0, [Validators.required, Validators.min(0)]],
      stitch: [''],
      image_url: ['', Validators.required],
      cloudinary_public_id: ['']
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allCovers = data;
        this.filteredCovers.set(data);
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.filterCovers();
  }

  filterCovers() {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      this.filteredCovers.set(this.allCovers);
      return;
    }

    const filtered = this.allCovers.filter(cover =>
      cover.vehicle_name.toLowerCase().includes(term) ||
      (cover.model?.toLowerCase() || '').includes(term) ||
      (cover.color?.toLowerCase() || '').includes(term) ||
      (cover.stitch?.toLowerCase() || '').includes(term)
    );
    this.filteredCovers.set(filtered);
  }

  // CRUD Operations
  createProduct() {
    if (this.productForm.invalid) {
      console.error('Form is invalid:', this.productForm.errors);
      alert('Please fill in all required fields correctly');
      return;
    }

    const product = this.productForm.value as Product;
    console.log('Creating product with form data:', JSON.stringify(product, null, 2));
    
    this.productService.createProduct(product).subscribe({
      next: (newProduct) => {
        this.allCovers.push(newProduct);
        this.filteredCovers.set([...this.allCovers]);
        this.loadProducts();
        this.cancelEdit();
      },
      error: (err) => console.error('Error creating product:', err)
    });
  }

  editProduct(product: Product) {
    this.editingProduct = { ...product };
    this.productForm.patchValue({
      vehicle_name: product.vehicle_name,
      model: product.model,
      color: product.color,
      price: product.price,
      quantity: product.quantity,
      stitch: product.stitch || '',
      image_url: product.image_url || '',
      cloudinary_public_id: product.cloudinary_public_id || ''
    });
    this.isEditing.set(true);
  }

  updateProduct() {
    if (this.productForm.invalid) {
      console.error('Form is invalid:', this.productForm.errors);
      alert('Please fill in all required fields correctly');
      return;
    }

    const product = { ...this.editingProduct, ...this.productForm.value } as Product;
    console.log('Updating product with form data:', JSON.stringify(product, null, 2));
    
    if (!product.id) return;
    
    this.productService.updateProduct(product.id, product).subscribe({
      next: () => {
        this.loadProducts();
        this.cancelEdit();
      },
      error: (err) => console.error('Error updating product:', err)
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editingProduct = null;
  }

  openAddForm() {
    this.editingProduct = null;
    this.productForm.reset({
      vehicle_name: '',
      model: '',
      color: '',
      price: 0,
      quantity: 0,
      stitch: '',
      image_url: '',
      cloudinary_public_id: ''
    });
    this.isEditing.set(true);
    console.log('Opened add form with reset form');
  }

  // Image upload methods
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      alert('Please select a file first');
      return;
    }

    this.uploadingImage.set(true);
    this.imageService.upload(this.selectedFile).subscribe({
      next: (response: any) => {
        console.log('Image upload response:', response);
        this.productForm.patchValue({
          image_url: response.secure_url,
          cloudinary_public_id: response.public_id
        });
        this.uploadingImage.set(false);
        alert('Image uploaded successfully!');
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.uploadingImage.set(false);
        alert('Error uploading image. Please try again.');
      }
    });
  }
}
