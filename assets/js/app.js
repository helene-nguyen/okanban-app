// on objet qui contient des fonctions
var app = {
  listIdCount: 0,
  inputCount: 0,
  cardIdCount: 0,
  // fonction d'initialisation, lancée au chargement de la page
  //^------------------ INIT
  init: function () {
    console.log('app.init !');

    app.addListenerToAction();
  },

  //^------------------ METHODS
  //*LISTENER TO ACTION
  addListenerToAction() {

    //~show modal list
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);

    //~close modal list
    const buttonsClose = document.querySelectorAll('.close');

    for (let btnClose of buttonsClose) {
      btnClose.addEventListener('click', app.hideModals)
    };

    //~valid form list
    document.querySelector('#form-list').addEventListener('submit', app.handleAddListForm);

    //^----------------------------------------------------------------

    //~show modal card
    const buttonsAddCard = document.querySelectorAll('.addCardButton');

    for (let btnAddCard of buttonsAddCard) {
      btnAddCard.addEventListener('click', app.showAddCardModal);
    };

    //~hide modal card
    const buttonsCloseCard = document.querySelectorAll('.closeCard');

    for (let btnClose of buttonsCloseCard) {
      btnClose.addEventListener('click', app.hideModalCard)
    };

    //~valid form card
    document.querySelector('#form-card').addEventListener('submit', app.handleAddCardForm);

  },
  //*SHOW LIST MODAL
  showAddListModal() {
    const modalElement = document.getElementById('addListModal');
    modalElement.classList.add('is-active');
  },
  //*HIDE MODALS
  hideModals() {
    const modalElement = document.getElementById('addListModal');
    modalElement.classList.remove('is-active');
  },
  //*HANDLE LIST FORM
  handleAddListForm(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    formData = formData.get('name');

    app.makeListInDOM(formData);

    const buttonAddCard = document.querySelector('.addCardButton');
    buttonAddCard.addEventListener('click', app.showAddCardModal);
  },
  //*MAKE NEW LIST
  makeListInDOM(name) {
    const template = document.querySelector('#template-list');

    const cardLists = document.querySelector('.card-lists');
    let clone = document.importNode(template.content, true);
    const list = clone.querySelector('.maListe');

    cardLists.insertAdjacentElement('afterbegin', list);

    const listNameElement = document.querySelector('.list-name');
    listNameElement.textContent = name;

    const dataListId = document.querySelector('.maListe');
    dataListId.setAttribute('data-list-id', `${app.listIdCount++}`);

    const inputTemplate = document.querySelector('.input-template');
    inputTemplate.setAttribute('value', `${app.inputCount++}`);

    app.hideModals();
  },
  //*SHOW CARD MODAL
  showAddCardModal(event) {
    const listElement = event.target.closest('.panel');
    const listId = listElement.dataset.listId;

    const inputCard = document.querySelector('.list-id');
    inputCard.value = listId;

    const modalElement = document.getElementById('addCardModal');
    modalElement.classList.add('is-active');

  },
  //*HIDE CARD MODAL
  hideModalCard() {
    const modalElement = document.getElementById('addCardModal');
    modalElement.classList.remove('is-active');
  },

  //*HANDLE CARD FORM
  handleAddCardForm(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let cardInfo = formData.get('card');
    let listId = formData.get('list_id');

    app.makeCardInDOM(cardInfo, listId);

    app.hideModalCard();
  },
  //*MAKE NEW CARD
  makeCardInDOM(cardInfo, listId) {
    const template = document.querySelector('#template-card');

    let clone = document.importNode(template.content, true);
    const card = clone.querySelector('.myCard');

    const goodListElement = document.querySelector(`[data-list-id="${listId}"]`);
    goodListElement.lastElementChild.insertAdjacentElement('afterbegin', card);
    const cardInfoValue = goodListElement.lastElementChild.querySelector('.card-info');
    cardInfoValue.textContent = cardInfo;

    const dataCardId = goodListElement.lastElementChild.querySelector('.myCard');
    dataCardId.setAttribute('data-card-id', `${app.cardIdCount++}`);

    console.log(dataCardId);

    app.buttonRemoveCard();

  },

  //*DO REMOVE CARD
  buttonRemoveCard() {
    

  },

  removeCard(event) {


  }
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);