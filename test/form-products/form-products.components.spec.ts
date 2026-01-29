import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SharedInputComponent } from '../../src/app/shared/components/shared-input/shared-input.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../src/app/shared/services/products.service';
import { FormProductsComponent } from '../../src/app/customer/pages/form-products/form-products.component';

describe('FormProductsComponent', () => {
  let component: FormProductsComponent;
  let fixture: ComponentFixture<FormProductsComponent>;
  let mockProductsService: any;

  beforeEach(waitForAsync(() => {
    mockProductsService = {
      registryProduct: jest.fn().mockReturnValue(of({})),
      updateProduct: jest.fn().mockReturnValue(of({})),
      verifyProductById: jest.fn().mockReturnValue(of(false))
    };

    TestBed.configureTestingModule({
      imports: [ 
        FormProductsComponent, 
        ReactiveFormsModule, 
        SharedInputComponent, 
        HttpClientTestingModule,
        CommonModule
      ],
      providers: [
        { provide: ProductsService, useValue: mockProductsService }
      ]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(FormProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
  }));

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('El botón reiniciar debe resetear el formulario', () => {
    component.isLoading.set(false);
    fixture.detectChanges();
    
    component.productDataForm.patchValue({
      id: 'testId',
      name: 'Test Name Longer',
      description: 'Test Description is long enough',
      logo: 'testLogo.png',
      date_release: '12/12/2026',
    });
    fixture.detectChanges();
    expect(component.productDataForm.get('id')?.value).toBe('testId');

    const resetButton = fixture.debugElement.query(By.css('button[type="reset"]'));
    expect(resetButton).toBeTruthy();
    resetButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.productDataForm.get('id')?.value).toBeNull();
  });

  test('El botón Reenviar debe llamar a registryProduct en modo creación', fakeAsync(() => {
    component.isUpdateMode.set(false);
    component.productDataForm.patchValue({
      id: 'trj-prb',
      name: 'Test Product',
      description: 'Test Description is long enough',
      logo: 'testlogo.png',
      date_release: '12/12/2026'
    });
    
    component.productDataForm.get('date_revision')?.setValue('12/12/2027');
    component.productDataForm.get('date_revision')?.enable(); 
    fixture.detectChanges();

    component.onSubmit();
    tick(1200);
    fixture.detectChanges();

    expect(mockProductsService.registryProduct).toHaveBeenCalled();
    
    tick(5000);
    fixture.detectChanges();
  }));

  test('El botón Reenviar debe llamar a updateProduct en modo actualización', fakeAsync(() => {
    component.isUpdateMode.set(true);
    component.productDataForm.patchValue({
      id: 'trj-prb',
      name: 'Test Product Updated',
      description: 'Test Description is long enough',
      logo: 'testlogo_updated.png',
      date_release: '12/12/2026'
    });
    
    component.productDataForm.get('date_revision')?.setValue('12/12/2027');
    component.productDataForm.get('date_revision')?.enable(); 
    fixture.detectChanges();

    component.onSubmit();
    tick(1200);
    fixture.detectChanges();

    expect(mockProductsService.updateProduct).toHaveBeenCalled();

    tick(5000);
    fixture.detectChanges();
  }));
});
