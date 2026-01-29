import { Component, inject, signal } from '@angular/core';
import { ProductI } from '../../../shared/interfaces/product.interface';
import { Router } from '@angular/router';
import { ProductsService } from '../../../shared/services/products.service';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-table-products',
  imports: [NgClass, DatePipe],
  templateUrl: './table-products.component.html',
})
export class TableProductsComponent {
  products: ProductI[] = [];
  searchQuery = signal<string>('');
  selectedOption = signal<number>(5);
  deleteModalVisible: boolean = false;
  productToDelete: ProductI | null = null;
  isLoading = signal<boolean>(false);

  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  private readonly router = inject(Router);
  private readonly serviceProducts = inject(ProductsService);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.serviceProducts.loadProducts().subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.products = res.data;
          this.isLoading.set(false);
        }, 800);
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.isLoading.set(false);
      },
    });
  }

  get filteredProducts(): ProductI[] {
    if (!this.searchQuery()) return this.products;
    const query = this.searchQuery().toLowerCase();
    return this.products.filter((product) => {
      const releaseDate = product.date_release
        ? new Date(product.date_release).toLocaleDateString('en-GB', { timeZone: 'UTC' })
        : '';
      const revisionDate = product.date_revision
        ? new Date(product.date_revision).toLocaleDateString('en-GB', { timeZone: 'UTC' })
        : '';
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        releaseDate.toLowerCase().includes(query) ||
        revisionDate.toLowerCase().includes(query)
      );
    });
  }

  get pagedProducts(): ProductI[] {
    return this.filteredProducts.slice(0, this.selectedOption());
  }

  get skeletonRows(): any[] {
    return Array(this.selectedOption()).fill(0);
  }

  navigateToForm(): void {
    this.router.navigate(['customer/form']);
  }

  editProduct(product: ProductI): void {
    this.router.navigate(['customer/form'], { state: product });
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  updateSelectedOption(event: Event): void {
    this.selectedOption.set(Number((event.target as HTMLSelectElement).value));
  }

  openDeleteModal(product: ProductI): void {
    this.productToDelete = product;
    this.deleteModalVisible = true;
  }

  closeDeleteModal(): void {
    this.deleteModalVisible = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (this.productToDelete && this.productToDelete.id) {
      this.serviceProducts.deleteProduct(this.productToDelete.id).subscribe({
        next: (response) => {
          this.alertMsg('success', 'Producto eliminado');
          this.loadProducts();
        },
        error: (error) => {
          this.alertMsg('error', 'Error al eliminar producto');
        },
      });
    }
  }

  alertMsg(alertType: any, alertMessage: string): void {
    this.alertType = alertType;
    this.alertMessage = alertMessage;
    this.closeDeleteModal();
    setTimeout(() => (this.alertMessage = ''), 5000);
  }
}
