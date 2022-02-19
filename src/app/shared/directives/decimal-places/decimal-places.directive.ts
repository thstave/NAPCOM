import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appDecimalPlaces]'
})

export class DecimalPlacesDirective implements OnInit {

  // Set the default number of decimals - will be replaced if included on template
  @Input() numOfDecimals? = 2;
  private regex: RegExp;
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  private startKeys: Array<string> = ['-'];
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    const regPattern = (this.numOfDecimals <= 0 ) ? '^[-]?\\d*$' : `^[-]?\\d*\\.?\\d{0,${this.numOfDecimals}}$`;

    console.log("Directive regex: " + regPattern);
    this.regex = new RegExp(regPattern, 'g');
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const position: number = this.el.nativeElement.selectionStart;
    let elementValue: string = this.el.nativeElement.value;

    // Check keys allowed for first character (minus sign)
    if ( position == 0 && this.startKeys.indexOf(event.key) !== -1 ) {
      return;
    }

    //Check if we are editing after the decimal but before the end of string
    //  If we already have the max number of decimal postions we may need to
    //  truncate the last digit.
    const decimalPos = elementValue.indexOf('.');
    if ( (decimalPos !== -1) &&
      (( elementValue.length - decimalPos) >= this.numOfDecimals) &&
      (position > decimalPos) && (position < elementValue.length)) {

      elementValue = elementValue.substring(0, elementValue.length - 1);
    }

    // Build what the new value will look like
    const value: string = [elementValue.slice(0, position), event.key == 'Decimal' ? '.' : event.key, elementValue.slice(position)].join('');

    // Use regex to validate - if valid just let the key entry to proceed down the event chain.
    if (value && !value.match(this.regex)) {

      // Not valid - prevent the key from going forward
      event.preventDefault();

    } else if ( elementValue !== this.el.nativeElement.value) {

      // There is a change to 'elementValue'.  Manually make the change and advance position.
      this.el.nativeElement.value = value;
      this.el.nativeElement.selectionStart = position + 1 ;

      // We manually made the change - prevent the key from going forward
      event.preventDefault();
    }
  }
}
