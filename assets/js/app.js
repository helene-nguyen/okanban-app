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
    //&--------------- LIST

    //~show modal list
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);

    //~close modal list
    const buttonsClose = document.querySelectorAll('.close');

    for (let btnClose of buttonsClose) {
      btnClose.addEventListener('click', app.hideModals);
    };

    //~valid form list
    document.querySelector('#form-list').addEventListener('submit', app.handleAddListForm);

    //&--------------- CARD

    //~show modal card
    const buttonsAddCard = document.querySelectorAll('.addCardButton');

    for (let btnAddCard of buttonsAddCard) {
      btnAddCard.addEventListener('click', app.showAddCardModal());
    };

    //~hide modal card
    const buttonsCloseCard = document.querySelectorAll('.closeCard');

    for (let btnClose of buttonsCloseCard) {
      btnClose.addEventListener('click', app.hideModalCard);
      btnClose.addEventListener('click', app.hideEditModalCard);
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

    //~button remove list
    app.buttonRemoveList();

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
  //*BUTTON REMOVE LIST
  buttonRemoveList() {
    const buttonsRemoveList = document.querySelectorAll('.deleteListButton');

    for (const buttonRemove of buttonsRemoveList) {
      buttonRemove.addEventListener('click', app.removeList);
    }
  },

  //*DO REMOVE LIST
  removeList(event) {
    let listToRemove = event.target.closest('.maListe');

    listToRemove.remove();
  },

  //*SHOW CARD MODAL
  showAddCardModal(event) {
    const listElement = event.target.closest('.panel');
    const listId = listElement.dataset.listId;

    const inputCardListId = document.querySelector('.list-id');
    inputCardListId.value = listId;

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

    const cardInput = document.querySelector('.card-id');
    cardInput.value = app.cardIdCount;

    let formData = new FormData(event.target);
    let cardInfo = formData.get('card');
    let listId = formData.get('list_id');
    let cardId = formData.get('card_id');

    console.log(`List id = ${listId}`);
    console.log(`Card id = ${cardId}`);

    app.makeCardInDOM(cardInfo, listId);

    app.buttonEditCard();
    app.buttonRemoveCard();
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

    const dataCardId = document.querySelector('.myCard');
    dataCardId.setAttribute('data-card-id', `${app.cardIdCount++}`);
  },

  //*BUTTON REMOVE CARD
  buttonRemoveCard() {
    const buttonsRemoveCard = document.querySelectorAll('.remove-card');

    for (const buttonRemove of buttonsRemoveCard) {
      buttonRemove.addEventListener('click', app.removeCard);
    }
  },
  //*DO REMOVE CARD
  removeCard(event) {
    let cardToRemove = event.target.closest('.myCard');
    cardToRemove.remove()
  },
  //*BUTTON EDIT CARD
  buttonEditCard() {
    const buttonsEditCard = document.querySelectorAll('.edit-card');

    for (const buttonEdit of buttonsEditCard) {
      buttonEdit.addEventListener('click', app.editCard);
    }
  },
  //*DO EDIT CARD
  editCard() {
    app.showEditCardModal();

    //~valid form card
    document.querySelector('#form-edit-card').addEventListener('submit', app.handleEditCardForm);

    
  },
  showEditCardModal() {
    const editModalElement = document.getElementById('editCardModal');
    editModalElement.classList.add('is-active');
  },
  hideEditModalCard() {
    const modalElement = document.getElementById('editCardModal');
    modalElement.classList.remove('is-active');
  },
  handleEditCardForm(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let cardInfo = formData.get('card');

    console.log(cardInfo);


    app.hideEditModalCard();
  }
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);