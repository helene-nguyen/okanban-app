//~IMPORT MODULES
import { url, userData, getCookie } from './index.js';

//~APPLICATION
const formModule = {
  //^VARIABLES
  message: '',
  //___navbar
  targetNavbarHome: document.querySelector('.nav-home'),
  targetAddListBtn: document.querySelector('.add-list'),
  targetNavbarConnexion: document.querySelector('.nav-connexion'),
  //___signup
  targetSignUpModalFormElement: document.getElementById('signup-form-modal'),
  targetSignUpElement: document.querySelector('#signup'),
  targetSubmitSignUpBtn: document.getElementById('save-user'),
  targetNotificationSignup: document.getElementById('notification-signup'),
  targetNotificationSignIn: document.getElementById('notification-signin'),
  //___signin
  targetSignInModalFormElement: document.getElementById('signin-form-modal'),
  targetSignInElement: document.querySelector('#signin'),
  //___signout
  targetSignOutElement: document.querySelector('.nav-logout'),
  targetSubmitSignOutBtn: document.getElementById('signout'),
  //___welcome
  targetWelcomeBlock: document.querySelector('.welcome-block'),
  targetWelcomeUser: document.querySelector('.welcome-user'),
  targetWelcomeTitle: document.getElementById('welcome-new-user'),
  //___ profile
  targetProfileMessageBlock: document.querySelector('.message-profile'),
  //^INITIALISATION
  init() {
    this.addListenerToAction();
  },
  //^METHODS
  addListenerToAction() {
    //~ Display signup modal
    // this.targetSignUpElement.addEventListener('click', this.displaySignUpModal);

    // //~ Do signup
    // this.targetSignUpModalFormElement.addEventListener('submit', this.doSignUp);

    //~ Display signin modal
    this.targetSignInElement.addEventListener('click', this.displaySignInModal);

    //~ Do signin
    this.targetSignInModalFormElement.addEventListener('submit', this.doSignIn);
  },

  displaySignUpModal(event) {
    event.preventDefault();
    formModule.targetSignUpModalFormElement.classList.add('is-active');

    formModule.closeModalBtn();
  },
  async doSignUp(event) {
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

    const response = await fetch(`${url}${userData}/signup`, options);

    //~ Handle notifications
    formModule.handleErrorNotifications(formModule.targetNotificationSignup, response);

    if (response.ok) {
      this.message = await response.json();

      //display block
      formModule.targetWelcomeBlock.style.display = 'none';
      formModule.targetWelcomeUser.style.display = 'block';
      formModule.targetWelcomeTitle.textContent = this.message;

      //Close signup modal
      formModule.hideModal();
      formModule.targetNotificationSignup.style.display = 'none';
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

    //~ Handle notifications
    formModule.handleErrorNotifications(formModule.targetNotificationSignIn, response);

    if (response.ok) {
      this.message = await response.json();

      //! COOKIE
      document.cookie = `access_token=${this.message.accessToken};expires=${new Date(Date.now() + 86400000).toUTCString}`;

      document.cookie = `refresh_token=${this.message.refreshToken};expires=${new Date(Date.now() + 86400000).toUTCString}`;

      //Close signup modal
      formModule.hideModal();
      formModule.targetNotificationSignup.style.display = 'none';

      //refresh page
      location.reload();
    }
    //Empty value input
    formModule.emptyValue();
  },
  //*BUTTON CLOSE MODAL
  closeModalBtn() {
    const buttonsClose = document.querySelectorAll('.close-form');

    for (const btnClose of buttonsClose) {
      btnClose.addEventListener('click', formModule.hideModal);
    }
    //hide error notification
    formModule.targetNotificationSignup.style.display = 'none';
    formModule.targetNotificationSignIn.style.display = 'none';

    const inputs = document.querySelectorAll('.input-pwd');
    for (const input of inputs) {
      input.classList.remove('is-danger');
    }

    this.emptyValue();
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
  },
  //* HANDLE NOTIFICATION
  async handleErrorNotifications(target, response) {
    document.querySelector('.input-mail').classList.remove('is-danger');
    const inputs = document.querySelectorAll('.input-pwd');
    for (const input of inputs) {
      input.classList.remove('is-danger');
    }

    for (const input of inputs) {
      input.classList.remove('is-danger');
    }

    if (response.status === 401 || response.status === 400) {
      this.message = await response.json();

      if (/([Pp]assword)/.test(this.message)) {
        for (const input of inputs) {
          input.classList.add('is-danger');
        }
      }

      if (/([Ee]xist)/.test(this.message)) {
        document.querySelector('.input-mail').classList.add('is-danger');
      }

      //notification
      target.textContent = this.message;
      target.style.display = 'block';
    }
  },
  //& SIGN OUT
  async doSignOut(event) {
    event.preventDefault();
    
    const deployPath = "/okanban-app"
    const token = getCookie('refresh_token');

    //! SEND TO HEADER FOR API
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await fetch(`${url}${userData}/signout`, options);

    function deleteCookie(name) {
      document.cookie = name + `=; Path=${deployPath}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
    deleteCookie('access_token');
    deleteCookie('refresh_token');

    if (response.ok) {
      //    const message = await response.json();
    }
    location.reload();
  }
};

export { formModule };
