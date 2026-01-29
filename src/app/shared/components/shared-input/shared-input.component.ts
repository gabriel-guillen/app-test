import {  Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTypesEnum } from '../../enums/input.enum';
import { ValidationsEnum } from '../../enums/validations.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'shared-input',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './shared-input.component.html',
})
export class SharedInputComponent {
  control = input.required<FormControl>();
  type = input<InputTypesEnum>(InputTypesEnum.TEXT);
  inputLabel = input<string>();
  placeholder = input<string>('');

  keypress = output<any>();
  keydown = output<any>();
  input = output<any>();

  validations: typeof ValidationsEnum = ValidationsEnum;

  eventKeyPress($event: any) {
    this.keypress.emit($event);
  }

  eventKeyDown($event: any) {
    this.keydown.emit($event);
  }

  eventInput($event: any) {
    this.input.emit($event);
  }
}
