//~IMPORT MODULES
import { url, userData } from './index.js';

//~APPLICATION
const formModule = {
  //^VARIABLES
  targetSignUpModalFormElement: document.getElementById('signup-form-modal'),
  targetSignUpElement: document.querySelector('#signup'),
  targetSignInElement: document.querySelector('#signin'),
  targetSubmitSignUpBtn: document.getElementById('save-user'),
  //^INITIALISATION
  init() {
    this.addListenerToActionSignUp();
  },
  //^METHODS
  addListenerToActionSignUp() {
    //& SIGN UP
    //Display signup modal
    formModule.targetSignUpElement.addEventListener('click', formModule.displaySignUpModal);
    //Close signup modal
    this.closeModalBtn();
    //Do signup
    formModule.targetSubmitSignUpBtn.addEventListener('click', formModule.doSignUp);
  },
  displaySignUpModal(event) {
    event.preventDefault();
    formModule.targetSignUpModalFormElement.classList.add('is-active');
  },
  doSignUp(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const email = data.get('email');
    const password = data.get('password');
    const passwordConfirm = data.get('passwordConfirm');

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        passwordConfirm
      })
      };
      




  },
  displaySignInModal() {},
  doSignIn() {},
  closeSignInModal() {},
  //*BUTTON CLOSE MODAL
  closeModalBtn() {
    const buttonsClose = document.querySelectorAll('.close-form');

    for (const btnClose of buttonsClose) {
      btnClose.addEventListener('click', formModule.hideModal);
    }
  },
  //*HIDE MODAL
  hideModal(event) {
    event.preventDefault();
    const modalElement = document.getElementById('signup-form-modal');
    modalElement.classList.remove('is-active');
  }
};

export { formModule };
