//~import module
import { url, allCards } from '../services/api.okanban.js';

const dragCard = {
  //^VARIABLES
  dragStartIndex: '',

  //^INITIALISATION
  init() {
    dragCard.eventListeners();
  },

  //^METHODS
  eventListeners() {
    //item we can drag
    const draggableCards = document.querySelectorAll('.my-card');
    for (const card of draggableCards) {
      card.addEventListener('dragstart', this.dragStart);
      card.addEventListener('dragend', this.dragEnd);
    }
    //place where we can drop
    const draggableCardsZone = document.querySelectorAll('.card-block-to-clone');

    for (const draggableCardZone of draggableCardsZone) {
      draggableCardZone.addEventListener('dragenter', this.dragEnter);
      draggableCardZone.addEventListener('dragleave', this.dragLeave);
      draggableCardZone.addEventListener('dragover', this.dragOver);
      draggableCardZone.addEventListener('drop', this.dragDropCard);
    }
  },
  //*________________ DRAGGABLE CARD _________________*/
  //~__________________________ DragStart
  dragStart(event) {
    //avoid to select the list
    event.stopPropagation();
    //target the card we want to drag
    const draggedCard = event.currentTarget;
    //the + symbol make it a Number
    dragCard.dragStartIndex = +draggedCard.querySelector('.card-order').value;

    event.dataTransfer.setData('text/plain', dragCard.dragStartIndex);
    event.dataTransfer.dropEffect = 'move';
    //when we drag the element, we want to make it disappear
    setTimeout(() => draggedCard.classList.add('hide-element'), 0);
  },
  //~__________________________ DragEnd
  dragEnd(event) {
    this.classList.remove('hide-element');
  },
  //*________________ DRAGGABLE ZONE CARD _________________*/
  //~__________________________ DragEnter
  dragEnter(event) {
    //avoid to select the list
    event.stopPropagation();
    //avoid to refresh the page
    event.preventDefault();
    this.classList.add('drag-over-card');
  },

  //~__________________________ DragLeave
  dragLeave(event) {
    //avoid to select the list
    event.stopPropagation();
    this.classList.remove('drag-over-card');
    this.style.transition = '0.5s ease-in-out';
  },

  //~__________________________ DragOver
  dragOver(event) {
    //avoid to select the list
    event.stopPropagation();
    //detect if we take the correct item
    const isLink = event.dataTransfer.types.includes('text/plain');
    //if true, allow drop effect, if not, remove event.preventDefault()
    if (isLink) {
      //avoid to refresh the page and allow droppping
      event.preventDefault();

      this.classList.add('drag-over-card');
    }
  },
  //~__________________________ DragDrop Card
  dragDropCard(event) {
    event.stopPropagation();
    //avoid to refresh the page and allow droppping
    event.preventDefault();
    const dragEndIndex = +this.querySelector('.card-order').value;

    dragCard.swapItems(dragCard.dragStartIndex, dragEndIndex, event);

    this.classList.remove('drag-over-card');
  },

  //~__________________________ Swap items
  /**
   * 
   * @param {int} fromIndex where to start
   * @param {int} toIndex where to end
   * @param {*} event 
   */
  swapItems(fromIndex, toIndex, event) {
    //#select item one
    const itemOne = document.querySelector(`[value='${fromIndex}'].card-order`).closest('.my-card');

    //#select item two
    const itemTwo = document.querySelector(`[value='${toIndex}'].card-order`).closest('.my-card');

    //#target card block where we want to drop
    const targetStartBlock = itemOne.closest('.card-block-to-clone');
    const targetEndBlock = event.target.closest('.card-block-to-clone');
    //#target block of cards where we want to drop
    const targetStartPanelBlock = itemOne.closest('.panel-block');
    const targetEndPanelBlock = itemTwo.closest('.panel-block');

    //#target id card
    const cardIdStart = targetStartBlock.querySelector('.my-card').getAttribute('data-card-id');
    const cardIdEnd = targetEndBlock.querySelector('.my-card').getAttribute('data-card-id');
    //#target id list
    const listIdStart = targetStartBlock.closest('.my-list').getAttribute('data-list-id');
    const listIdEnd = targetEndBlock.closest('.my-list').getAttribute('data-list-id');

    //! Be careful here
    //#if listId where we drag item is not the same as where want to drop, append to block

    if (listIdStart !== listIdEnd) {
      targetEndPanelBlock.insertAdjacentElement('afterbegin', targetStartBlock);

      const targetCardsEndPanelBlock = targetEndPanelBlock.querySelectorAll('.my-card');

      let cardsElement = [];

      for (const targetCard of targetCardsEndPanelBlock) {
        const cardOrder = targetCard.querySelector('.card-order').value;

        cardsElement.push(cardOrder);
      }
      //revert list
      cardsElement.sort((a, b) => b - a);

      for (let index = 0; index < targetCardsEndPanelBlock.length; index++) {
        const newCardOrder = cardsElement[index];
        const cardElement = targetCardsEndPanelBlock[index];
        const cardId = cardElement.getAttribute('data-card-id');
        cardElement.querySelector('.card-order').value = newCardOrder;

        dragCard.updateCard(cardId, newCardOrder, listIdEnd);
      }
    } else {
      //start block is where you drag the item
      //end block is where you want to drop the item
      targetStartBlock.appendChild(itemTwo);
      targetEndBlock.appendChild(itemOne);

      //swap the position
      itemOne.value = `${toIndex}`;
      itemTwo.value = `${fromIndex}`;

      dragCard.updateCard(cardIdStart, toIndex, listIdEnd);
      dragCard.updateCard(cardIdEnd, fromIndex, listIdStart);
    }
  },

  //~__________________________ Update cards

  async updateCard(cardId, orderId, listId) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: orderId,
        //by default user 1 for now
        user_id: 1,
        list_id: listId
      })
    };

    const response = await fetch(`${url}${allCards}/${cardId}`, options);

    if (response.ok) {
      await response.json();
    }
  }
};

export { dragCard };
