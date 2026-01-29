import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../scripts/environments/environment';
import { GeneralI, ResponseI } from '../interfaces/general.interface';
import { ProductI } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  loadProducts(): Observable<GeneralI<ProductI>> {
    return this.http.get<GeneralI<ProductI>>(`${this.apiUrl}/bp/products`);
  }

  verifyProductById(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/bp/products/verification/${id}`);
  }

  registryProduct(body: ProductI): Observable<ResponseI>{
    return this.http.post<ResponseI>(`${this.apiUrl}/bp/products`, body);
  }

  updateProduct(id: string, body: ProductI): Observable<ResponseI>{
    return this.http.put<ResponseI>(`${this.apiUrl}/bp/products/${id}`, body);
  }

  deleteProduct(id: string): Observable<ResponseI>{
    return this.http.delete<ResponseI>(`${this.apiUrl}/bp/products/${id}`);
  }
}
