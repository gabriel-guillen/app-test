import { AbstractControl } from '@angular/forms';

export const dateValidator = (
  control: AbstractControl
): { [key: string]: any } | null => {
  if (!control.value) {
    return null;
  }
  
  const parts = control.value.split('/');
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const enteredDate = new Date(year, month, day);
  
  if (
    enteredDate.getFullYear() !== year ||
    enteredDate.getMonth() !== month ||
    enteredDate.getDate() !== day
  ) {
    return { invalidDate: 'Fecha inválida' };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (enteredDate < today) {
    return { invalidDate: 'La fecha debe ser igual o mayor a la fecha actual' };
  }
  
  return null;
};

export function formatDate(dateStr: string): string {
  if (!dateStr) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}