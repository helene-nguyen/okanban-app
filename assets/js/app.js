//~import api
import {
  url,
  allLists,
  allCards
} from './services/api.okanban.js'

const app = {
  //^------------------ VARIABLES

  //^------------------ INIT
  init: function () {

    app.addListenerToAction();
  },

  //^------------------ METHODS
  //*LISTENER TO ACTION
  addListenerToAction() {
    //&--------------------------------------  LIST

    //~show modal list
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);

    //~close modal list
    const buttonsClose = document.querySelectorAll('.close');

    for (let btnClose of buttonsClose) {
      btnClose.addEventListener('click', app.hideModals);
    };

    //~valid form list
    document.querySelector('#form-list').addEventListener('submit', app.handleAddListForm);

    //&-------------------------------------- CARD

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
  //?-----------------------------LIST------------------------------//
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
        "description": listDescription,
        "order": listOrder,
        "user_id": listUser
      })
    };

    const response = await fetch(`${url}${allLists}`, options);

    if (response.ok) {

      const listMessage = await response.json();
      alert(listMessage);
      location.reload();
    };

    const buttonAddCard = document.querySelector('.addCardButton');
    buttonAddCard.addEventListener('click', app.showAddCardModal);

    app.hideModals();
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


  //&===============================================================

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
  //?-----------------------------CARD------------------------------//
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
    console.log(`Carte choisie avec la liste suivante = ${inputCardListId}`);

    document.querySelector(`#addCardModal input[name="card_title"]`).value = '';
    document.querySelector(`#addCardModal input[name="card_description"]`).value = '';

    const modalElement = document.getElementById('addCardModal');
    modalElement.classList.add('is-active');
    modalElement.querySelector('.card-list-id').value = listId;

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
  async handleAddCardForm(event) {
    event.preventDefault();

   
  
    const data = new FormData(event.target);

    const cardTitle = data.get('card_title');
    const cardDescription = data.get('card_description');
    const cardColor = data.get('card_color');
    const cardOrder = data.get('card_order');
    const cardUser = data.get('card_user');
    const listId = data.get('list_id');
    //todo remove
    console.log(`Titre de la nouvelle carte = ${cardTitle}`);
    console.log(`Description = ${cardDescription}`);
    console.log(`Couleur = ${cardColor}`);
    console.log(`Position de la carte = ${cardOrder}`);
    console.log(`Utilisateur = ${cardUser}`);
    console.log(`List id récupérée = ${listId}`);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": cardTitle,
        "description": cardDescription,
        "color": cardColor,
        "order": cardOrder,
        "user_id": cardUser,
        "list_id": listId
      })
    };

    const response = await fetch(`${url}${allCards}`, options);

    if (response.ok) {
      const cardMessage = await response.json();
      alert(cardMessage);
      location.reload();
    };
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
    card.querySelector('.card-order').value = cardOrder;
    card.querySelector('.card-user').value = cardUser;
    card.querySelector('.card-list-id').value = listId;
    card.style.borderTop = `4px solid ${color}`;

    document.querySelector(`[data-list-id="${listId}"]`).querySelector('.panel-block').append(card);
    //todo put cardId
    app.hideModalCard();
    app.buttonEditCard();
    app.buttonRemoveCard();
  },

  //*BUTTON REMOVE CARD
  buttonRemoveCard() {
    const buttonsRemoveCard = document.querySelectorAll('.remove-card');

    for (const buttonRemove of buttonsRemoveCard) {
      buttonRemove.addEventListener('click', app.confirmModalDeleteCard);
    }
  },
  //*BUTTON SHOW MODAL REMOVE CARD
  confirmModalDeleteCard(event) {
    const cardToRemove = event.target.closest('.myCard');
    const cardId = cardToRemove.dataset.cardId;

    const confirmDeleteBtnElement = document.querySelector('#removeModal');
    confirmDeleteBtnElement.classList.add('is-active');
    confirmDeleteBtnElement.querySelector('.card-id').value = cardId;
    confirmDeleteBtnElement.querySelector('.form-delete').addEventListener('submit', app.buttonConfirmDeleteCard);

    app.closeModalDeleteBtn();
  },
  //*BUTTON CONFIRM DELETE
  async buttonConfirmDeleteCard(event) {
    event.preventDefault();

    const cardIdToRemove = document.querySelector('#removeModal').querySelector('.card-id').value;
    console.log("cardIdToRemove: ", cardIdToRemove);
    const cardToRemove = document.querySelector(`[data-card-id="${cardIdToRemove}"]`);

    const options = {
      method: 'DELETE'
    };

    const response = await fetch(`${url}${allCards}/${cardIdToRemove}`, options);

    if (response.ok) {
      const deleteCard = await response.json();
      console.log(deleteCard);
      cardToRemove.remove();
      app.hideModalDeleteList();
      alert(deleteCard);
      location.reload();
    }
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
    const listId = cardElement.querySelector('.card-list-id').value;
    const cardOrder = cardElement.querySelector('.card-order').value;
    const cardUser = cardElement.querySelector('.card-user').value;
    //todo remove
    console.log("cardId choisie pour modif: ", cardId);
    console.log("listId choisie pour modif: ", listId);
    console.log("cardOrder choisie pour modif: ", cardOrder);
    console.log("cardUser choisie pour modif: ", cardUser);

    app.showEditCardModal(cardId, listId, cardOrder, cardUser);

    //~valid form card
    document.querySelector('#form-edit-card').addEventListener('submit', app.handleEditCardForm);

  },
  //*SHOW EDIT CARD MODAL
  showEditCardModal(cardId, listId, cardOrder, cardUser) {
    document.querySelector(`#editCardModal input[name="card_edit"]`).value = '';

    const editModalElement = document.getElementById('editCardModal');
    editModalElement.classList.add('is-active');
    editModalElement.querySelector('.card-id').value = cardId;
    editModalElement.querySelector('.card-order').value = cardOrder;
    editModalElement.querySelector('.card-user').value = cardUser;
    editModalElement.querySelector('.list-id').value = listId;
  },
  //*HIDE EDIT CARD MODAL
  hideEditModalCard() {
    const modalElement = document.getElementById('editCardModal');
    modalElement.classList.remove('is-active');
  },
  //*HANDLE EDIT CARD FORM MODAL
  async handleEditCardForm(event) {
    event.preventDefault();
    const cardId = event.target.querySelector('.card-id').value;
    console.log("cardId modifiée: ", cardId);
    const targetCardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    console.log("Carte visée: ", targetCardElement);


    let data = new FormData(event.target);
    const cardEdit = data.get('card_edit');
    const cardDescription = data.get('card_description');
    const cardColor = data.get('card_color');
    const cardOrder = data.get('card_order');
    const listId = data.get('list_id');
    //todo remove
    console.log(`Titre de la nouvelle carte = ${cardEdit}`);
    console.log(`Description = ${cardDescription}`);
    console.log(`Couleur = ${cardColor}`);
    console.log(`Ordre = ${cardOrder}`);
    console.log(`La liste = ${listId}`);


    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": cardEdit,
        "description": cardDescription,
        "color": cardColor,
        "order": cardOrder
      })
    };

    const response = await fetch(`${url}${allCards}/${cardId}`, options);

    if (response.ok) {
      const updateCard = await response.json();
      console.log(updateCard);

      targetCardElement.querySelector('.card-info').textContent = cardEdit;
      targetCardElement.querySelector('.card-description').textContent = cardDescription;
      targetCardElement.style.borderTop = `4px solid ${cardColor}`;


      app.hideEditModalCard();
    }

    // location.reload()

  },

  //*FETCH ALL CARDS BY LIST ID
  async fetchAllCards() {

    const response = await fetch((`${url}${allCards}`));

    if (response.ok) {
      const cards = await response.json();

      for (const card of cards) {
        app.makeCardInDOM(card.id, card.title, card.description, card.color, card.list_id, card.order, card.user_id);
      }

      app.buttonRemoveCard();
    }
  },
};

app.init();