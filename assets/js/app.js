//~import api
import {
  converter
} from './convertHexToRGB.js';
import {
  dragList
} from './dragList.js';

import {
  url,
  allLists,
  allCards,
  allTags
} from './services/api.okanban.js'

const app = {
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

    for (const btnClose of buttonsClose) {
      btnClose.addEventListener('click', app.hideModals);
    };

    //~valid form list
    document.querySelector('#form-list').addEventListener('submit', app.handleAddListForm);

    //&-------------------------------------- CARD

    //~show modal card
    const buttonsAddCard = document.querySelectorAll('.addCardButton');

    for (const btnAddCard of buttonsAddCard) {
      btnAddCard.addEventListener('click', app.showAddCardModal());
    };

    //~hide modal card
    const buttonsCloseCard = document.querySelectorAll('.closeCard');

    for (const btnClose of buttonsCloseCard) {
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

    const data = new FormData(event.target);
    const listName = data.get('list_name');
    const listDescription = data.get('list_description');
    const listUser = data.get('list_user');
    //REMOVE TEST
    console.log(`List name = ${listName}`);
    console.log(`List description = ${listDescription}`);
    console.log(`List user = ${listUser}`);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": listName,
        "description": listDescription,
        "user_id": listUser
      })
    };

    const response = await fetch(`${url}${allLists}`, options);

    if (response.ok) {

      const listMessage = await response.json();
      //todo remove
      console.log("listMessage: ", listMessage);
      // app.makeListInDOM('', listName, listDescription, listUser)
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
    const clone = document.importNode(template.content, true);
    const list = clone.querySelector('.my-list');
    list.setAttribute('data-list-id', `${id}`);
    list.addEventListener('dragstart', dragList.handleDragStartList);

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
    //~listener for drag list
    dragList.eventListeners();
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
    const listToRemove = event.target.closest('.my-list');
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
      //todo remove
      console.log(deleteList);

      app.hideModalDeleteList();
      //trick to see deletion immediately
      listToRemove.remove();
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
    const listTitleElement = event.target.closest('.my-list');
    const listId = listTitleElement.dataset.listId;
    const currentTitle = listTitleElement.querySelector('.list-title').textContent;
    const currentDescription = listTitleElement.querySelector('.list-description').textContent;
    //todo remove after test 
    console.log("Titre actuel : ", currentTitle);
    console.log("Description actuelle : ", currentDescription);

    const data = new FormData(event.target);

    let listName = data.get('list_name');
    listName === '' ? listName = currentTitle : listName;
    console.log("Le nom de la liste éditée : ", listName);
    let listDescription = data.get('list_description');
    console.log("La description éditée : ", listDescription);

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
      //todo remove
      console.log(updateList);

      listTitleElement.querySelector('.list-title').textContent = listName;
      listTitleElement.querySelector('.list-description').textContent = listDescription;
      listTitleElement.querySelector('.edit-list-form').classList.add('is-hidden');
      /* location.reload(); */
    }

  },
  //?-----------------------------CARD------------------------------//
  /**
   * 
   * @param {*} event 
   */
  //*SHOW CARD MODAL
  showAddCardModal(event) {
    const listId = event.target.closest('.my-list').dataset.listId;
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
      console.log("cardMessage: ", cardMessage);
      /* app.makeCardInDOM('', cardTitle, cardDescription, cardColor, listId, cardOrder, cardUser); */
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

    const clone = document.importNode(template.content, true);
    const card = clone.querySelector('.myCard');
    card.setAttribute('data-card-id', `${cardId}`);
    //~set data cards id
    card.querySelector('.card-info').textContent = cardInfo;
    card.querySelector('.card-description').textContent = cardDescription;
    card.querySelector('.card-order').value = cardOrder;
    card.querySelector('.card-user').value = cardUser;
    card.querySelector('.card-list-id').value = listId;
    card.style.borderTop = `4px solid`;
    //color in HEX
    card.style.borderTopColor = color;

    document.querySelector(`[data-list-id="${listId}"]`).querySelector('.panel-block').insertAdjacentElement('afterbegin', card);
    //todo put cardId
    app.hideModalCard();
    app.buttonEditCard();
    app.buttonRemoveCard();
    //todo draggable

    const cardsElement = document.querySelectorAll(`[data-card-id="${cardId}"]`);

    for (const card of cardsElement) {
      //todo get all form tags for handle add tags
      card.querySelector('#container-new-tag').addEventListener('submit', (event) => {
        event.preventDefault();
        app.handleAddTagsForm(cardId, event);
      });
    };

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
      app.hideModalDeleteList();
      //trick to see deletion immediately
      cardToRemove.remove();
      /* alert(deleteCard); */
      /*  location.reload(); */
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
    document.querySelector(`#editCardModal input[name="card_description"]`).value = '';

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
    const targetCardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    //CURRENT CARD
    const currentTitleCard = targetCardElement.querySelector('.card-info').textContent;
    const currentDescriptionCard = targetCardElement.querySelector('.card-description').textContent;

    let currentColorCard = targetCardElement.style.borderTopColor;
    let valueRGB = currentColorCard.split("(")[1].split(")")[0];
    currentColorCard = converter.getHexFromRGB(valueRGB);

    //todo remove after test
    console.log("_______________________________________________");
    console.log("valueRGB: ", valueRGB);
    console.log("currentTitleCard: ", currentTitleCard);
    console.log("currentDescriptionCard: ", currentDescriptionCard);
    console.log("currentColorCard: ", currentColorCard); //first in RGB
    console.log("_______________________________________________");
    // console.log("cardId modifiée: ", cardId);
    // console.log("Carte visée: ", targetCardElement);

    const data = new FormData(event.target);

    //!condition if modify only one value
    let cardEdit = data.get('card_edit');
    let cardDescription = data.get('card_description');
    let cardColor = data.get('card_color');

    cardEdit === '' ? cardEdit = currentTitleCard : cardEdit;
    cardDescription === '' ? cardDescription = currentDescriptionCard : cardDescription;
    cardColor === '' ? cardColor = currentColorCard : cardColor;

    const cardOrder = data.get('card_order');
    const listId = data.get('list_id');
    //todo remove
    console.log(`Titre de la nouvelle carte = ${cardEdit}`);
    console.log(`Description de la nouvelle carte = ${cardDescription}`);
    console.log(`Couleur de la nouvelle carte = ${cardColor}`);
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
    };

  },

  //*FETCH ALL CARDS BY LIST ID
  async fetchAllCards() {

    const response = await fetch((`${url}${allCards}`));

    if (response.ok) {
      const cards = await response.json();

      for (const card of cards) {
        app.makeCardInDOM(card.id, card.title, card.description, card.color, card.list_id, card.order, card.user_id);
        app.fetchAllTagsByCardId(card.id);
      }

      app.buttonRemoveCard();
    }
  },

  //^-----------------------------------------------TAGS
  //*HANDLE TAG FORM
  async handleAddTagsForm(cardId, event) {
    console.log(event.target);

    const data = new FormData(event.target);
    const tagName = data.get('new_tag');
    const tagColor = data.get('color_tag');

    //todo remove
    console.log("La couleur de mon tag: ", tagColor);
    console.log("Le nom de mon tag: ", tagName);
    console.log("La carte que j'ai choisi pour modifier le tag", cardId);

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": tagName,
        "color": tagColor
      })
    };

    const response = await fetch(`${url}${allCards}/${cardId}${allTags}/${tagName}`, options);

    if (response.ok) {
      const tagMessage = await response.json();
      console.log("tagMessage: ", tagMessage);

      location.reload();
    };


  },
  //*FETCH ALL TAGS BY CARD ID
  async fetchAllTagsByCardId(cardId) {

    const response = await fetch((`${url}${allCards}/${cardId}/tags`));

    if (response.ok) {
      const tags = await response.json();

      for (const tag of tags) {
        app.makeTagInDOM(tag.id, tag.name, tag.color, cardId);
      }
    }
  },
  //* MAKE TAGS
  async makeTagInDOM(tagId, tagName, tagColor, cardId) {
    //~Cloning template
    const template = document.querySelector('#template-tag');

    const clone = document.importNode(template.content, true);
    const tag = clone.querySelector('.tag');
    //~set data tags id
    tag.dataset.tagId = tagId;
    tag.querySelector('.tag-name').textContent = tagName;
    tag.style.backgroundColor = tagColor;
    //~apply event listener on delete tag button
    tag.querySelector('.btn-delete-tag').addEventListener('click', app.doRemoveTag);

    document.querySelector(`[data-card-id="${cardId}"]`).querySelector('.tag-box').append(tag);

  },
  //*DO DELETE TAGS
  async doRemoveTag(event) {
    const tagToRemove = event.target.closest('[data-tag-id]');
    const tagIdToRemove = tagToRemove.dataset.tagId;
    const cardId = event.target.closest('[data-card-id]').dataset.cardId;

    //todo remove
    console.log(tagToRemove);
    console.log("Id du tag sélectionné: ", tagIdToRemove);

    const options = {
      method: 'DELETE'
    };

    const response = await fetch(`${url}${allCards}/${cardId}${allTags}/${tagIdToRemove}`, options);

    if (response.ok) {
      const deleteTag = await response.json();
      //todo remove
      console.log(deleteTag);
      //trick to see it immediately
      tagToRemove.remove();
    }
  }
};

export {
  app
};