interface IBuyNow {
  test(): boolean;
}

export class BuyNow implements IBuyNow {
  billingForm: HTMLFormElement | null;
  firstNameMinLength = 3;
  lastNameMinLength = 4;
  emailLimit = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
  addressWordsCount = 3;
  addressWordsLength = 5;
  addressLimit = [this.addressWordsCount, this.addressWordsLength];
  phoneNumberLimit = new RegExp('[+]+[0-9]{9}');
  cardNumberLength = 16;
  cardNumberSplitter = ' ';
  cardholderWords = 2;
  cardHolderNameLimit = [this.cardholderWords, this.firstNameMinLength];
  carddateLength = 5;
  carddateSplitter = '/';
  CVVlength = 3;
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  email: HTMLInputElement;
  address: HTMLInputElement;
  phone: HTMLInputElement;
  cardnumber: HTMLInputElement;
  cardholder: HTMLInputElement;
  carddate: HTMLInputElement;
  cvv: HTMLInputElement;
  submitFormButton: HTMLButtonElement | null | undefined;

  constructor() {
    this.billingForm = document.querySelector('.billing__form');
    this.firstName = this.billingForm?.firstName;
    this.lastName = this.billingForm?.lastName;
    this.email = this.billingForm?.email;
    this.address = this.billingForm?.address;
    this.phone = this.billingForm?.phone;
    this.cardnumber = this.billingForm?.cardnumber;
    this.cardholder = this.billingForm?.cardholder;
    this.carddate = this.billingForm?.carddate;
    this.cvv = this.billingForm?.cvv;
    this.submitFormButton = this.billingForm?.querySelector('.button__submit_order');
  }

  public test() {
    const firstname = this.itemTest(this.firstName, this.firstNameMinLength);
    const lastname = this.itemTest(this.lastName, this.lastNameMinLength);
    const email = this.itemTest(this.email, this.emailLimit);
    const address = this.testString(this.address, this.addressLimit);
    const phone = this.itemTest(this.phone, this.phoneNumberLimit);
    const cardnumber = this.testCardData(this.cardnumber, this.cardNumberLength);
    const cardholder = this.testString(this.cardholder, this.cardHolderNameLimit);
    const carddate = this.testCardData(this.cardnumber, this.carddateLength);
    const cvv = this.testCardData(this.cardnumber, this.CVVlength);

    return firstname && lastname && email && address && phone && cardnumber && cardholder && carddate && cvv
      ? true
      : false;
  }

  private itemTest(e: HTMLInputElement, limit: number | RegExp) {
    const errorMessage = e.closest('.form__item')?.querySelector('.input__billing_error');
    const p = document.createElement('p');
    p.classList.add('input__billing_error');

    switch (e.type) {
      case 'text':
        if (Number(e.value) < this.firstNameMinLength) {
          if (!errorMessage) {
            p.textContent = `* too short, requires ${limit} or more letters`;
            e.insertAdjacentElement('afterend', p);
          }
          return false;
        }
        return true;

      case 'email':
        if (limit instanceof RegExp) {
          if (!errorMessage && !limit.test(e.value)) {
            p.textContent = `* email should be in the following template 'example@****.**`;
            e.insertAdjacentElement('afterend', p);
            return false;
          }
          return true;
        }
        break;

      case 'tel':
        if (limit instanceof RegExp) {
          if (!errorMessage && !limit.test(e.value)) {
            p.textContent = `* phone number must start with '+' and requires 9 or more digits length`;
            e.insertAdjacentElement('afterend', p);
            return false;
          }
          return true;
        }
        break;
    }
  }

  private testString(e: HTMLInputElement, limit: Array<number>) {
    const errorMessage = e.closest('.form__item')?.querySelector('.input__billing_error');

    const arr = this.address.value.split(' ');
    console.log(arr);
    const p = document.createElement('p');
    p.classList.add('input__billing_error');

    if (arr.length < limit[0] || !(arr.filter((e) => e.length >= limit[1]).length >= limit[0])) {
      if (!errorMessage) {
        p.textContent = `* too short, requires ${e === this.address ? 'min. ' : ''}${limit[0]} words with more than ${
          limit[1] - 1
        } letters`;
        e.insertAdjacentElement('afterend', p);
        return false;
      }
      return false;
    }
    return true;
  }

  private testCardData(e: HTMLInputElement, limit: number) {
    const errorMessage = e.closest('.form__item')?.querySelector('.input__billing_error');
    const p = document.createElement('p');
    p.classList.add('input__billing_error');

    if (this.cardnumber.value.length !== limit) {
      if (!errorMessage) {
        p.textContent = `* card number requires ${this.cardNumberLength} digits`;
        e.closest('.form__item_row')?.insertAdjacentElement('afterend', p);
        return false;
      }
      return false;
    }
    return true;
  }

  public noLetters(e: KeyboardEvent) {
    if ('1234567890'.indexOf(e.key) < 0 || this.cardnumber.value.length >= this.cardNumberLength) e.preventDefault();
  }

  public changePaymentSystemImage() {
    const img: HTMLImageElement | null | undefined = this.billingForm?.querySelector('.payment__image');
    switch (this.cardnumber.value[0]) {
      case undefined:
        if (img) img.src = '../assets/icons/payment/generic.svg';
        break;
      case '0':
        if (img) img.src = '../assets/icons/payment/alipay.svg';
        break;
      case '1':
        if (img) img.src = '../assets/icons/payment/amex.svg';
        break;
      case '2':
        if (img) img.src = '../assets/icons/payment/discover.svg';
        break;
      case '3':
        if (img) img.src = '../assets/icons/payment/elo.svg';
        break;
      case '4':
        if (img) img.src = '../assets/icons/payment/visa.svg';
        break;
      case '5':
        if (img) img.src = '../assets/icons/payment/hipercard.svg';
        break;
      case '6':
        if (img) img.src = '../assets/icons/payment/jcb.svg';
        break;
      case '7':
        if (img) img.src = '../assets/icons/payment/mastercard.svg';
        break;
      case '8':
        if (img) img.src = '../assets/icons/payment/paypal.svg';
        break;
      case '9':
        if (img) img.src = '../assets/icons/payment/unionpay.svg';
        break;
    }
  }

  public formatCardCode(limit: number, splitter: string) {
    let cardCode = this.carddate.value.replace(/[^\d]/g, '').substring(0, limit - 1);
    cardCode = cardCode !== '' ? <string>cardCode.match(/.{1,2}/g)?.join(splitter) : '';
    this.carddate.value = cardCode;
    console.log(cardCode);
  }

  private resetForm() {
    this.billingForm?.reset();
  }
}
