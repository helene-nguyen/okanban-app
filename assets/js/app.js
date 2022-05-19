// on objet qui contient des fonctions
const app = {
  //^------------------ VARIABLES
  listIdCount: 0,
  inputCount: 0,
  cardIdCount: 0,
  base_url: 'http://localhost:4100',

  //^------------------ INIT
  init: function () {

    app.addListenerToAction();
  },

  //^------------------ METHODS
  //*LISTENER TO ACTION
  /**
   * Initialize event of app
   */
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
  /**
   * All about list
   */
  //*SHOW LIST MODAL
  showAddListModal() {
    document.querySelector(`#addListModal input[name="name"]`).value = '';

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
    console.log(formData);

    app.makeListInDOM(formData);

    const buttonAddCard = document.querySelector('.addCardButton');
    buttonAddCard.addEventListener('click', app.showAddCardModal);

    //~button remove list
    app.buttonRemoveList();
  },
  /**
   * 
   * @param {string} name name of list
   */
  //*MAKE NEW LIST
  makeListInDOM(name, id) {

    //~clone our list template
    const template = document.querySelector('#template-list');
    let clone = document.importNode(template.content, true);
    const list = clone.querySelector('.maListe');
    list.setAttribute('data-list-id', `${id}`);
    //~append to list board
    const cardLists = document.querySelector('.card-lists');
    cardLists.insertAdjacentElement('afterbegin', list);
    cardLists.querySelector('.list-name').textContent = name;
    cardLists.querySelector('.input-template').setAttribute('value', `${id}`);

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
  /**
   * 
   * All about card
   */
  //*SHOW CARD MODAL
  showAddCardModal(event) {
    const listElement = event.target.closest('.panel');
    const listId = listElement.dataset.listId;

    const inputCardListId = document.querySelector('.list-id');
    inputCardListId.value = listId;

    document.querySelector(`#addCardModal input[name="card"]`).value = '';

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

    const cardInput = document.querySelector('.card-id');
    cardInput.value = app.cardIdCount;

    let formData = new FormData(event.target);
    let cardInfo = formData.get('card');
    let listId = formData.get('list_id');
    let cardId = formData.get('card_id');

    console.log(`List id = ${listId}`);
    console.log(`Card id = ${cardId}`);

    app.makeCardInDOM(cardInfo, listId);

    app.buttonEditCard(cardId);
    app.buttonRemoveCard();
    app.hideModalCard();

  },

  /**
   * 
   * @param {string} cardInfo info card
   * @param {int} listId id of list
   * @param {string} color 
   * @param {int} cardId 
   * @param {string} cardDescription 
   */
  //*MAKE NEW CARD
  makeCardInDOM(cardInfo, listId, color, cardId, cardDescription) {
    //~Cloning template
    const template = document.querySelector('#template-card');

    let clone = document.importNode(template.content, true);
    const card = clone.querySelector('.myCard');
    //~set data cards id
    card.setAttribute('data-card-id', `${cardId}`);
    card.style.borderTop = `4px solid ${color}`;

    //~get data attributes, another way to use is dataset.listId(turns into camelcase)
    const goodListElement = document.querySelector(`[data-list-id="${listId}"]`);
    goodListElement.querySelector('.panel-block').insertAdjacentElement('afterbegin', card);
    goodListElement.querySelector('.card-info').textContent = cardInfo;
    goodListElement.querySelector('.card-description').textContent = cardDescription;

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
  /**
   * Editing cards
   */
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
  //*SHOW EDIT CARD MODAL
  showEditCardModal() {
    //todo -> get button edit + get data-car-id
    // document.querySelector(`#addCardModal input[name="card"]`).value = '';
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
    let cardInfo = formData.get('card');

    console.log(cardInfo);

    app.hideEditModalCard();
  },
  //*FETCH ALL LISTS
  async fetchListsFromAPI() {
    const response = await fetch(`${app.base_url}/lists`);

    if (response.ok) {
      const lists = await response.json();

      for (const list of lists) {
        app.makeListInDOM(list.title, list.id);
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

  //*FETCH ALL CARDS BY LIST ID
  async fetchAllCards() {

    const response = await fetch((`${app.base_url}/cards`));

    if (response.ok) {
      const cards = await response.json();

      for (const card of cards) {
        app.makeCardInDOM(card.title, card.list_id, card.color, card.id, card.description);
      }

      app.buttonRemoveCard();
    }
  }
};

document.addEventListener('DOMContentLoaded', app.init);