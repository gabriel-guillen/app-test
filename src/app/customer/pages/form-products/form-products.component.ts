import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { ProductsService } from '../../../shared/services/products.service';
import { dateValidator, formatDate } from '../../../shared/helpers/date.validation.helper';
import { formatDateYYYYMMDDtoDDMMYYYY, getDateOneYearLater } from '../../../shared/helpers/date-operation.helper';

@Component({
  selector: 'app-form-products',
  imports: [CommonModule, ReactiveFormsModule, SharedInputComponent],
  templateUrl: './form-products.component.html',
})
export class FormProductsComponent {
  productDataForm!: FormGroup;
  isUpdateMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  alertMessage: string = '';
  alertType = signal<'success' | 'error'>('success');

  
  private readonly fb = inject(FormBuilder);
  private readonly serviceProducts = inject(ProductsService);


  ngOnInit() {
    this.isLoading.set(true);
    this.buildForm();

    setTimeout(() => {
      this.subscribeChange();
      this.isLoading.set(false);
    }, 1000);
  }

  buildForm() {
    this.productDataForm = this.fb.group({
      id: [
        null,
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ],
          asyncValidators: [this.idValidator()],
          updateOn: 'blur',
        }
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [null, Validators.required],
      date_release: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=[\d/]+$)(\d{2})\/(0[1-9]|1[0-2])\/(\d{4})$/),
          dateValidator,
        ],
      ],
      date_revision: [null, Validators.required],
    });
    this.productDataForm.get('date_revision')?.disable();
  }

  subscribeChange() {
    this.productDataForm.get('date_release')?.statusChanges.subscribe({
      next: () => {
        this.productDataForm
          .get('date_revision')
          ?.setValue(
            getDateOneYearLater(
              this.productDataForm.get('date_release')?.value,
            ),
          );
      },
    });

    const product = history.state;
    if (product && product.id) {
      const dateRelease = formatDateYYYYMMDDtoDDMMYYYY(product.date_release);
      const dateRevision = formatDateYYYYMMDDtoDDMMYYYY(product.date_revision);
      this.productDataForm.patchValue({
        id: product.id,
        name: product.name,
        description: product.description,
        logo: product.logo,
        date_release: dateRelease,
        date_revision: dateRevision,
      });
      this.productDataForm.get('id')?.disable();
      this.isUpdateMode.set(true);
    }
  }

  resetFormData(): void {
    this.productDataForm.reset();
    this.productDataForm.get('date_revision')?.disable();
  }

  onSubmit(): void {
    if (this.productDataForm.valid) {
      this.isSubmitting.set(true);
      let formData = this.productDataForm.getRawValue();

      formData.date_release = formatDate(formData.date_release);
      formData.date_revision = formatDate(formData.date_revision);

      if (this.isUpdateMode()) {
        this.serviceProducts.updateProduct(formData.id, formData).subscribe({
          next: (response) => {
            setTimeout(() => {
              this.productDataForm.reset();
              this.alertMsg('success', 'Producto actualizado');
              this.isSubmitting.set(false);
            }, 1200);
          },
          error: (error) => {
            this.alertMsg('error', 'Error al actualizar producto');
            this.isSubmitting.set(false);
          },
        });
      } else {
        this.serviceProducts.registryProduct(formData).subscribe({
          next: (response) => {
            setTimeout(() => {
              this.productDataForm.reset();
              this.alertMsg('success', 'Producto Registrado');
              this.isSubmitting.set(false);
            }, 1200);
          },
          error: (error) => {
            this.alertMsg('error', 'Error al registrar producto');
            this.isSubmitting.set(false);
          },
        });
      }
    } else {
      this.productDataForm.markAllAsTouched();
    }
  }

  getFormControl(name: string) {
    return this.productDataForm.get(name) as FormControl;
  }

  idValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.serviceProducts.verifyProductById(control.value).pipe(
        map((isTaken) => (isTaken ? { invalidId: true } : null))
      );
    };
  }

  alertMsg(alertType: 'success' | 'error', alertMessage: string): void {
    this.alertType.set(alertType);
    this.alertMessage = alertMessage;
    setTimeout(() => (this.alertMessage = ''), 5000);
  }
}
