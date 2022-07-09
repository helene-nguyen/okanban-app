//~IMPORT MODULES
import { url, userData } from './index.js';

//~APPLICATION
const formModule = {
  //^VARIABLES
  targetSignUpModalFormElement: document.getElementById('signup-form-modal'),
  targetSignInModalFormElement: document.getElementById('signin-form-modal'),
  targetSignUpElement: document.querySelector('#signup'),
  targetSignInElement: document.querySelector('#signin'),
  targetSubmitSignUpBtn: document.getElementById('save-user'),
  //^INITIALISATION
  init() {
    this.addListenerToActionSignUp();
  },
  //^METHODS
  addListenerToActionSignUp() {
    //~ Display signup modal
    formModule.targetSignUpElement.addEventListener('click', formModule.displaySignUpModal);

    //~ Do signup
    formModule.targetSignUpModalFormElement.addEventListener('submit', formModule.doSignUp);

    //~ Display signin modal
    formModule.targetSignInElement.addEventListener('click', formModule.displaySignInModal);

    //~ Do signin
    formModule.targetSignInModalFormElement.addEventListener('submit', formModule.doSignIn);
  },

  displaySignUpModal(event) {
    event.preventDefault();
    formModule.targetSignUpModalFormElement.classList.add('is-active');

    formModule.closeModalBtn();
  },
  async doSignUp(event) {
    event.preventDefault();
    let message;

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

    const response = await fetch(`${url}${userData}/signup`, options);

    if (response.status === 401) { 
      message = await response.json();
      console.log("message: ", message);
    }

    if (response.ok) {
      message = await response.json();
      console.log('message: ', message);

      //code here
     
  
      //Close signup modal
      formModule.hideModal();
    } 
    //Empty value input
    formModule.emptyValue();
  },
  //& SIGN IN
  displaySignInModal(event) {
    event.preventDefault();
    formModule.targetSignInModalFormElement.classList.add('is-active');

    formModule.closeModalBtn();
  },
  async doSignIn(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const email = data.get('email');
    const password = data.get('password');

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    };

    const response = await fetch(`${url}${userData}/signin`, options);

    if (response.status === 401) { 
      message = await response.json();
      console.log("message: ", message); 
    }

    if (response.ok) {
      const message = await response.json();
      console.log('message: ', message);

      //code here
      // formModule.targetSignUpElement.style.display = 'none';

      //Close signup modal
      formModule.hideModal();
      //Empty value input
      formModule.emptyValue();

    }
  },
  //*BUTTON CLOSE MODAL
  closeModalBtn() {
    const buttonsClose = document.querySelectorAll('.close-form');

    for (const btnClose of buttonsClose) {
      btnClose.addEventListener('click', formModule.hideModal);
    }
  },
  //*HIDE MODAL
  hideModal(event) {
    //signup
    const modalElementSignUp = document.getElementById('signup-form-modal');
    modalElementSignUp.classList.remove('is-active');
    //signin
    const modalElementSignIn = document.getElementById('signin-form-modal');
    modalElementSignIn.classList.remove('is-active');
  },
  //*EMPTY INPUTS VALUES
  emptyValue() {
    const inputs = document.querySelectorAll('.input');

    for (const input of inputs) {
      input.value = '';
    }
  }
};

export { formModule };
