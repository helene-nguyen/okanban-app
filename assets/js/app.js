//~import api
import {
  url,
  allLists,
  allCards
} from './services/api.okanban.js'


const app = {
  //^------------------ VARIABLES
  base_url: 'http://localhost:4100',

  //^------------------ INIT
  init: function () {

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

    //~fetch all list
    app.fetchListsFromAPI();
  },
  //*FETCH ALL LISTS
  async fetchListsFromAPI() {
    const response = await fetch(`${url}${allLists}`);

    if (response.ok) {
      const lists = await response.json();

      for (const list of lists) {
        app.makeListInDOM(list.id, list.title, list.description, list.user_id, list.order);
      }

      const buttonsAddCard = document.querySelectorAll('.addCardButton');

      for (const button of buttonsAddCard) {
        button.addEventListener('click', app.showAddCardModal);
      }
      //~button remove list
      app.buttonRemoveList();
      app.fetchAllCards();
    }
  },
  //*SHOW LIST MODAL
  showAddListModal() {
    document.querySelector(`#addListModal input[name="list_name"]`).value = '';
    document.querySelector(`#addListModal input[name="list_description"]`).value = '';

    const modalElement = document.getElementById('addListModal');
    modalElement.classList.add('is-active');
  },
  //*HIDE MODALS
  hideModals() {
    const modalElement = document.getElementById('addListModal');
    modalElement.classList.remove('is-active');
  },
  //*HANDLE LIST FORM
  async handleAddListForm(event) {
    event.preventDefault();

    let data = new FormData(event.target);
    const listName = data.get('list_name');
    const listDescription = data.get('list_description');
    const listUser = data.get('list_user');
    const listOrder = data.get('list_order');
    //REMOVE TEST
    console.log(`List name = ${listName}`);
    console.log(`List description = ${listDescription}`);
    console.log(`List user = ${listUser}`);
    console.log(`List order = ${listOrder}`);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": listName,
        "order": listOrder,
        "description": listDescription,
        "user_id": listUser
      })
    };

    const response = await fetch(`${url}${allLists}`, options);

    if (response.ok) {
      const listMessage = await response.json();
      console.log(listMessage);
      app.hideModals();

      location.reload();
    }

    const buttonAddCard = document.querySelector('.addCardButton');
    buttonAddCard.addEventListener('click', app.showAddCardModal);

    //~button remove list
    app.buttonRemoveList();
  },
  /**
   * 
   * @param {string} name 
   * @param {int} user 
   * @param {int} order 
   */
  //*MAKE NEW LIST
  makeListInDOM(id, title, description, user, order) {

    //~clone our list template
    const template = document.querySelector('#template-list');
    let clone = document.importNode(template.content, true);
    const list = clone.querySelector('.maListe');
    list.setAttribute('data-list-id', `${id}`);

    //~append to list board
    const cardLists = document.querySelector('.card-lists');
    cardLists.insertAdjacentElement('afterbegin', list);
    cardLists.querySelector('.list-title').textContent = title;
    cardLists.querySelector('.list-description').textContent = description;
    cardLists.querySelector('.list-user').setAttribute('value', `${user}`);
    cardLists.querySelector('.list-order').setAttribute('value', `${order}`);

    app.hideModals();
    app.editListForm();

    //~form edit
    const editListFormElements = document.querySelectorAll('.edit-list-form');

    for (const element of editListFormElements) {
      element.addEventListener('submit', app.handleAddNewListTitle);
    }

    //~button remove list
    app.buttonRemoveList();
  },
  //*BUTTON REMOVE LIST
  buttonRemoveList() {
    const buttonsRemoveList = document.querySelectorAll('.deleteListButton');

    for (const buttonRemove of buttonsRemoveList) {
      buttonRemove.addEventListener('click', app.confirmModalDeleteList);
    }
  },
  //*BUTTON SHOW MODAL REMOVE LIST
  confirmModalDeleteList(event) {
    const listToRemove = event.target.closest('.maListe');
    const listId = listToRemove.dataset.listId;

    const confirmDeleteBtnElement = document.querySelector('#removeModal');
    confirmDeleteBtnElement.classList.add('is-active');
    confirmDeleteBtnElement.querySelector('.list-id').value = listId;
    confirmDeleteBtnElement.querySelector('.form-delete').addEventListener('submit', app.buttonConfirmDeleteList);

    app.closeModalDeleteBtn();
  },
  //*BUTTON CONFIRM DELETE
  async buttonConfirmDeleteList(event) {
    event.preventDefault();

    const listIdToRemove = document.querySelector('#removeModal').querySelector('.list-id').value;
    const listToRemove = document.querySelector(`[data-list-id="${listIdToRemove}"]`);

    const options = {
      method: 'DELETE'
    };

    const response = await fetch(`${url}${allLists}/${listIdToRemove}`, options);

    if (response.ok) {
      const deleteList = await response.json();
      console.log(deleteList);

      listToRemove.remove();
      app.hideModalDeleteList();
    }

  },
  //*BUTTON CLOSE MODAL REMOVE LIST
  closeModalDeleteBtn() {
    const confirmDeleteBtnElement = document.querySelector('#removeModal');
    const closeButtons = confirmDeleteBtnElement.querySelectorAll('.close');

    for (const button of closeButtons) {
      button.addEventListener('click', app.hideModalDeleteList)
    }
  },
  //*HIDE MODAL REMOVE LIST
  hideModalDeleteList() {
    const confirmDeleteBtnElement = document.querySelector('#removeModal');
    confirmDeleteBtnElement.classList.remove('is-active');
  },

  //*EDIT FORM LIST
  editListForm() {
    const listsTitleElement = document.querySelectorAll('.list-title');

    for (const listsTitle of listsTitleElement) {
      listsTitle.addEventListener('click', app.displayEditListForm);
    }
  },
  //*DISPLAY EDIT FORM LIST
  displayEditListForm(event) {

    const editListFormElement = event.target.closest(`[data-list-id]`).querySelector('.edit-list-form');
    editListFormElement.classList.toggle('is-hidden');
    editListFormElement.querySelector('.new-list').value = '';
    editListFormElement.querySelector('.new-description').value = '';

  },
  //*HANDLE EDIT FORM LIST
  async handleAddNewListTitle(event) {
    event.preventDefault();
    const listTitleElement = event.target.closest('.maListe');
    const listId = listTitleElement.dataset.listId;

    const data = new FormData(event.target);
    const listName = data.get('list_name');
    const listDescription = data.get('list_description');
    const listOrder = data.get('list_order');
    const listUser = data.get('list_user');

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": listName,
        "description": listDescription,
        "order": listOrder,
        "user_id": listUser
      })
    };

    const response = await fetch(`${url}${allLists}/${listId}`, options);

    if (response.ok) {
      const updateList = await response.json();
      console.log(updateList);

      listTitleElement.querySelector('.list-title').textContent = listName;
      listTitleElement.querySelector('.list-description').textContent = listDescription;
      listTitleElement.querySelector('.edit-list-form').classList.add('is-hidden');
    }

  },
  /**
   * 
   * @param {*} event 
   */
  //*SHOW CARD MODAL
  showAddCardModal(event) {
    const listId = event.target.closest('.maListe').dataset.listId;
    //todo remove
    console.log(`Liste choisie = ${listId}`);
    const inputCardListId = document.querySelector('.card-list-id').value = listId;
    //todo remove
    console.log(`Id de la liste dans input carte choisie = ${inputCardListId}`);

    document.querySelector(`#addCardModal input[name="card_title"]`).value = '';
    document.querySelector(`#addCardModal input[name="card_description"]`).value = '';

    const modalElement = document.getElementById('addCardModal');
    modalElement.classList.add('is-active');
  },
  //*HIDE CARD MODAL
  hideModalCard() {
    const modalElement = document.getElementById('addCardModal');
    modalElement.classList.remove('is-active');
  },
  /**
   * 
   * @param {*} event valid form
   */
  //*HANDLE CARD FORM
  handleAddCardForm(event) {
    event.preventDefault();
    const cardElement = event.target.closest('.myCard');
    const cardId = cardElement.dataset.cardId;
    
    console.log("cardElement: ", cardElement);
    
    //todo remove
    console.log(`Carte choisie = ${cardId}`);

    const data = new FormData(event.target);
    const cardTitle = data.get('card_title');
    const cardDescription = data.get('card_description');
    const cardColor = data.get('card_color');
    const listId = data.get('list_id');
    //todo remove
    console.log(`Titre de la nouvelle carte = ${cardTitle}`);
    console.log(`Description = ${cardDescription}`);
    console.log(`Couleur = ${cardColor}`);
    console.log(`List id récupérée = ${listId}`);

    /*  const options = {
      method: 'POST',
      // headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        
      })
    } */
    //todo reload so can remove this
    app.makeCardInDOM(cardTitle, cardDescription, cardColor, listId);

    app.buttonRemoveCard();
    app.hideModalCard();
  },
  /**
   * 
   * @param {string} cardInfo info card
   * @param {string} cardDescription 
   * @param {string} color 
   * @param {int} listId id of list
   */
  //*MAKE NEW CARD
  makeCardInDOM(cardId, cardInfo, cardDescription, color, listId, cardOrder, cardUser) {
    //~Cloning template
    const template = document.querySelector('#template-card');

    let clone = document.importNode(template.content, true);
    const card = clone.querySelector('.myCard');
    card.setAttribute('data-card-id', `${cardId}`);
    //~set data cards id
    card.querySelector('.card-info').textContent = cardInfo;
    card.querySelector('.card-description').textContent = cardDescription;
    card.querySelector('.card-order').textContent = cardOrder;
    card.querySelector('.card-user').textContent = cardUser;
    card.style.borderTop = `4px solid ${color}`;

    document.querySelector(`[data-list-id="${listId}"]`).querySelector('.panel-block').append(card);
    //todo put cardId
    app.buttonEditCard();

  },

  //*BUTTON REMOVE CARD
  buttonRemoveCard() {
    const buttonsRemoveCard = document.querySelectorAll('.remove-card');

    for (const buttonRemove of buttonsRemoveCard) {
      buttonRemove.addEventListener('click', app.removeCard);
    }
  },
  /**
   * 
   * @param {string} event target closest element
   */
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
  editCard(event) {
    const cardElement = event.target.closest('.myCard');
    const cardId = cardElement.dataset.cardId;
    console.log("cardId chosen: ", cardId);

    app.showEditCardModal();

    //~valid form card
    document.querySelector('#form-edit-card').addEventListener('submit', app.handleEditCardForm);

  },
  //*SHOW EDIT CARD MODAL
  showEditCardModal() {
    document.querySelector(`#editCardModal input[name="card_edit"]`).value = '';
    const editModalElement = document.getElementById('editCardModal');
    editModalElement.classList.add('is-active');
  },
  //*HIDE EDIT CARD MODAL
  hideEditModalCard() {
    const modalElement = document.getElementById('editCardModal');
    modalElement.classList.remove('is-active');
  },
  //*HANDLE EDIT CARD FORM MODAL
  handleEditCardForm(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let cardInfo = formData.get('card_edit');
    //todo remove
    console.log(cardInfo);

    app.hideEditModalCard();
  },

  //*FETCH ALL CARDS BY LIST ID
  async fetchAllCards() {

    const response = await fetch((`${url}${allCards}`));

    if (response.ok) {
      const cards = await response.json();

      for (const card of cards) {
        app.makeCardInDOM(card.id, card.title, card.description, card.color, card.list_id);
      }

      app.buttonRemoveCard();
    }
  },


};

document.addEventListener('DOMContentLoaded', app.init);