//~IMPORT MODULES

//~APPLICATION
const formModule = {
  //^VARIABLES
  targetSignUpModalFormElement: document.getElementById('signup-form-modal'),
  targetSignUpElement: document.querySelector('#signup'),
  targetSignInElement: document.querySelector('#signin'),
  //^INITIALISATION
  init() {
    this.displaySignUpModal();
    this.closeModalBtn();
  },
  //^METHODS
  displaySignUpModal() {
    formModule.targetSignUpElement.addEventListener('click', event => {
      formModule.targetSignUpModalFormElement.classList.add('is-active');
    });
  },
  doSignUp() {},
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
