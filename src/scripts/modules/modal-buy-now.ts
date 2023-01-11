import IBuyNow from '../../types/modal-buy-now-types';
import { iconCardsAssets } from '../../assets/icons/icons-card/icon-card';

export class BuyNow implements IBuyNow {
  billingForm: HTMLFormElement | null;
  showBillButton: HTMLButtonElement | null;
  billPopup: HTMLElement | null;
  farewellPopup: HTMLDivElement | null;
  closeButton: HTMLDivElement | null | undefined;
  overlay: HTMLElement | null;
  firstNameMinLength = 3;
  lastNameMinLength = 4;
  // eslint-disable-next-line prettier/prettier, no-useless-escape
  emailLimit = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  addressWordsCount = 3;
  addressWordsLength = 5;
  addressLimit = [this.addressWordsCount, this.addressWordsLength];
  nameLimit = new RegExp(`^([a-zA-Za-яА-Я]{3,30})$`);
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

  constructor() {
    this.billingForm = document.querySelector('.billing__form');
    this.showBillButton = document.querySelector('.button__submit_buynow');
    this.billPopup = document.querySelector('.buy-now__popup');
    this.farewellPopup = document.querySelector('.finish-order__popup');
    this.closeButton = this.billPopup?.querySelector('.close__button');
    this.overlay = document.querySelector('.overlay');
    this.firstName = this.billingForm?.firstName;
    this.lastName = this.billingForm?.lastName;
    this.email = this.billingForm?.email;
    this.address = this.billingForm?.address;
    this.phone = this.billingForm?.phone;
    this.cardnumber = this.billingForm?.cardnumber;
    this.cardholder = this.billingForm?.cardholder;
    this.carddate = this.billingForm?.carddate;
    this.cvv = this.billingForm?.cvv;
  }

  public test() {
    const firstname = this.nameTest(this.firstName, this.nameLimit);
    const lastname = this.nameTest(this.lastName, this.nameLimit);
    const email = this.itemTest(this.email, this.emailLimit);
    const address = this.testString(this.address, this.addressLimit);
    const phone = this.itemTest(this.phone, this.phoneNumberLimit);
    const cardnumber = this.testCardData(this.cardnumber, this.cardNumberLength);
    const cardholder = this.testString(this.cardholder, this.cardHolderNameLimit);
    const carddate = this.testCardData(this.carddate, this.carddateLength);
    const cvv = this.testCardData(this.cvv, this.CVVlength);

    return firstname && lastname && email && address && phone && cardnumber && cardholder && carddate && cvv
      ? true
      : false;
  }

  private nameTest(e: HTMLInputElement, limit: RegExp) {
    const errorMessage = e.closest('.form__item')?.querySelector('.input__billing_error');
    const p = document.createElement('p');
    p.classList.add('input__billing_error');
    if (limit instanceof RegExp) {
      if (!errorMessage && !limit.test(e.value)) {
        p.textContent = `* name must be at least three letters length and not contain digits`;
        e.insertAdjacentElement('afterend', p);
        return false;
      } else if (limit.test(e.value)) {
        errorMessage?.remove();
        return true;
      }
    }
  }

  private itemTest(e: HTMLInputElement, limit: number | RegExp) {
    const errorMessage = e.closest('.form__item')?.querySelector('.input__billing_error');
    const p = document.createElement('p');
    p.classList.add('input__billing_error');

    switch (e.type) {
      case 'email':
        if (limit instanceof RegExp) {
          if (!errorMessage && !limit.test(e.value)) {
            p.textContent = `* email should be in the following template 'example@****.**`;
            e.insertAdjacentElement('afterend', p);
            return false;
          } else if (limit.test(e.value)) {
            errorMessage?.remove();
            console.log('true');
            return true;
          }
        }
        break;

      case 'tel':
        if (limit instanceof RegExp) {
          if (!errorMessage && !limit.test(e.value)) {
            p.textContent = `* phone number must start with '+' and requires 9 or more digits length`;
            e.insertAdjacentElement('afterend', p);
            return false;
          } else if (limit.test(e.value)) {
            errorMessage?.remove();
            return true;
          }
        }
        break;
    }
  }

  private testString(e: HTMLInputElement, limit: Array<number>) {
    const errorMessage = e.closest('.form__item')?.querySelector('.input__billing_error');

    const arr = e.value.split(' ');
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
    } else if (arr.length >= limit[0] && arr.filter((e) => e.length >= limit[1]).length >= limit[0]) {
      errorMessage?.remove();
      return true;
    }
  }

  private testCardData(e: HTMLInputElement, limit: number) {
    const errorMessage = e.closest('.form__item')?.querySelector('.input__billing_error');
    const p = document.createElement('p');
    p.classList.add('input__billing_error');

    if (e.value.length !== limit) {
      if (!errorMessage) {
        p.textContent = `* requires ${limit} digits`;
        if (e !== this.cvv || this.carddate) {
          e.closest('.form__item_row')?.insertAdjacentElement('afterend', p);
        }
        e.closest('.form__item_column')?.insertAdjacentElement('afterend', p);
        return false;
      }
      return false;
    }
    errorMessage?.remove();
    return true;
  }

  public noLetters(e: KeyboardEvent, element: HTMLInputElement, limit: number) {
    if ('1234567890'.indexOf(e.key) < 0 || element.value.length >= limit) e.preventDefault();
  }

  public changePaymentSystemImage() {
    const img: HTMLImageElement | null | undefined = this.billingForm?.querySelector('.payment__image');
    switch (this.cardnumber.value[0]) {
      case undefined:
        if (img) img.src = iconCardsAssets.generic;
        break;
      case '0':
        if (img) img.src = iconCardsAssets.alipay;
        break;
      case '1':
        if (img) img.src = iconCardsAssets.amex;
        break;
      case '2':
        if (img) img.src = iconCardsAssets.discover;
        break;
      case '3':
        if (img) img.src = iconCardsAssets.elo;
        break;
      case '4':
        if (img) img.src = iconCardsAssets.visa;
        break;
      case '5':
        if (img) img.src = iconCardsAssets.hipercard;
        break;
      case '6':
        if (img) img.src = iconCardsAssets.jcb;
        break;
      case '7':
        if (img) img.src = iconCardsAssets.mastercard;
        break;
      case '8':
        if (img) img.src = iconCardsAssets.paypal;
        break;
      case '9':
        if (img) img.src = iconCardsAssets.unionpay;
        break;
    }
  }

  public formatCardCode(limit: number, splitter: string) {
    let cardCode = this.carddate.value.replace(/[^\d]/g, '').substring(0, limit - 1);
    cardCode = cardCode !== '' ? <string>cardCode.match(/.{1,2}/g)?.join(splitter) : '';
    if (+cardCode.split('/')[0] > 12 && cardCode.length === this.carddateLength) {
      cardCode = `${12}/${cardCode.split('/')[1]}`;
    }
    this.carddate.value = cardCode;
  }

  public numberReduce(limit: number) {
    if (this.cvv.value.length > limit) {
      this.cvv.value = this.cvv.value.slice(0, limit);
    }
  }

  public showBillPopup() {
    this.billPopup?.classList.remove('hidden');
    this.overlay?.classList.add('overlay_active');
  }

  public hideBillPopup() {
    this.billPopup?.classList.add('hidden');
    this.overlay?.classList.remove('overlay_active');
    localStorage.removeItem('OnlineStoreBuyNow');
  }

  public showRedirectPopup() {
    this.farewellPopup?.classList.remove('hidden');
    this.hideBillPopup();
    this.overlay?.classList.add('overlay_active');
    setTimeout(() => this.redirect(), 3000);
  }

  private redirect() {
    location.href = location.href
      .split('/')
      .splice(0, location.href.split('/').length - 1)
      .join('/');
    this.farewellPopup?.classList.add('hidden');
    this.overlay?.classList.remove('overlay_active');
    localStorage.removeItem('OnlineStoreBuyNow');
  }
}
