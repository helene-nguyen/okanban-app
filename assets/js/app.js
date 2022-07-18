//~IMPORT MODULES
import { listModule, cardModule, userModule, formModule, getCookie } from './index.js';
// import { animationLetters } from "./index.js";

//~APPLICATION
const app = {
  //^_______________________ INIT
  init: function() {
    app.addListenerToAction();
    // animationLetters.defineAnimation();
  },
  //^_______________________ METHODS

  addListenerToAction() {
    const userConnected = getCookie('access_token');
    const profile = document.getElementById('profile');
    const home = document.getElementById('home');

    if (userConnected && home) {
      //display none
      formModule.targetNavbarConnexion.style.display = 'none';
      formModule.targetWelcomeBlock.style.display = 'none';
      //display block
      formModule.targetWelcomeUser.style.display = 'block';
      formModule.targetWelcomeTitle.textContent = 'Go to the Super Kanban !';
      formModule.targetNavbarHome.style.display = 'block';
    }

    if (userConnected && profile) {
      //#_______________________  LIST
      //~show modal list
      document.getElementById('addListButton').addEventListener('click', listModule.showAddListModal);

      //~close modal list
      const buttonsClose = document.querySelectorAll('.close');

      for (const btnClose of buttonsClose) {
        btnClose.addEventListener('click', listModule.hideModals);
      }

      //~valid form list
      document.querySelector('#form-list').addEventListener('submit', listModule.handleAddListForm);

      //~fetch all list
      listModule.fetchListsFromAPI();

      //#_______________________ CARD

      //~show modal card
      const buttonsAddCard = document.querySelectorAll('.addCardButton');

      for (const btnAddCard of buttonsAddCard) {
        btnAddCard.addEventListener('click', cardModule.showAddCardModal);
      }

      //~hide modal card
      const buttonsCloseCard = document.querySelectorAll('.closeCard');

      for (const btnClose of buttonsCloseCard) {
        btnClose.addEventListener('click', cardModule.hideModalCard);
        btnClose.addEventListener('click', cardModule.hideEditModalCard);
      }

      //~valid form card
      document.querySelector('#form-card').addEventListener('submit', cardModule.handleAddCardForm);

      //~Do signout
      formModule.targetSubmitSignOutBtn.addEventListener('click', formModule.doSignOut);

      //display block
      formModule.targetAddListBtn.style.display = 'flex';
      formModule.targetSignOutElement.style.display = 'block';

      //display message
      formModule.targetProfileMessageBlock.textContent = `Let's make a super Kanban !`
    }

    //~show signup modal home page
    const signUpElement = document.querySelector('#signup');
    const signInElement = document.querySelector('#signin');

    if (signUpElement && signInElement) formModule.init();
  }
};

//~LAUNCH THE APP
app.init();
