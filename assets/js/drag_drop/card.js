//~import module
import { url, allCards } from '../services/api.okanban.js';

const dragCard = {
  //^VARIABLES
  dragStartIndex: '',

  //^INITIALISATION
  init() {
    // console.log('test');
    dragCard.eventListeners();
  },

  //^METHODS
  eventListeners() {
    //item we can drag
    const draggableCard = document.querySelector('.my-card');
    draggableCard.addEventListener('dragstart', this.dragStart);
    //place where we can drop
    const draggableZone = document.querySelector('.card-block-to-clone');
    draggableZone.addEventListener('dragenter', this.dragEnter);
    draggableZone.addEventListener('dragleave', this.dragLeave);
    draggableZone.addEventListener('dragover', this.dragOver);
    draggableZone.addEventListener('drop', this.dragDropCard);
  },

  //~__________________________ Dragstart
  dragStart(event) {
    //avoid to select the list
    event.stopPropagation();
    //target the card we want to drag
    const draggedCard = event.target;
    //the + symbol make it a Number
    dragCard.dragStartIndex = +draggedCard.querySelector('.card-order').value;
    console.log('My card start position is the : ', dragCard.dragStartIndex);

    event.dataTransfer.dropEffect = 'move';
    //when we drag the element, we want to make it disappear
    setTimeout(() => draggedCard.classList.add('hide-element'), 0);
  },

  //~__________________________ DragEnter
  dragEnter(event) {
    //avoid to refresh the page
    event.preventDefault();
    //avoid to select the list
    event.stopPropagation();
    this.classList.add('drag-over-card');
  },

  //~__________________________ DragLeave
  dragLeave() {
    this.classList.remove('drag-over-card');
    this.style.opacity = '1';
    this.style.transition = '0.5s ease-in-out';
  },

  //~__________________________ DragOver
  dragOver(event) {
    //avoid to refresh the page
    event.preventDefault();
    //avoid to select the list
    event.stopPropagation();
    this.classList.add('drag-over-card');
  },
  //~__________________________ DragDrop Card
 /*  dragDropPanel(listIdStart, listIdEnd) {
  
} */
  //~__________________________ DragDrop Card
  dragDropCard(event) {
    event.stopPropagation();
    const dragEndIndex = +this.querySelector('.card-order').value;
    console.log('My end position is : ', dragEndIndex);
    
    dragCard.swapItems(dragCard.dragStartIndex, dragEndIndex, event);
    
    this.classList.remove('drag-over-card');
    this.style.opacity = '1';
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
    itemOne.classList.remove('hide-element');
    //#select item two
    const itemTwo = document.querySelector(`[value='${toIndex}'].card-order`).closest('.my-card');

    //#target block where we want to drop
    const targetStartBlock = itemOne.closest('.card-block-to-clone');
    const targetStartPanelBlock = itemOne.closest('.panel-block');
    
    const targetEndBlock = event.target.closest('.card-block-to-clone');
    const targetEndPanelBlock = itemTwo.closest('.panel-block');
    
    //#target id
    const listIdStart = targetStartBlock.closest('.my-list').getAttribute('data-list-id');
    const cardIdStart = targetStartBlock.querySelector('.my-card').getAttribute('data-card-id');
    const listIdEnd = targetEndBlock.closest('.my-list').getAttribute('data-list-id');
    const cardIdEnd = targetEndBlock.querySelector('.my-card').getAttribute('data-card-id');
    
    //remove after test 
    console.log("This card come from list Id : ", listIdStart);
    console.log("This card will go to list Id : ", listIdEnd);
    console.log('itemOne: ', itemOne);
    console.log('itemTwo: ', itemTwo);
    console.log('targetStartBlock: ', targetStartBlock);
    console.log("targetStartPanelBlock: ", targetStartPanelBlock);
    console.log('targetEndBlock: ', targetEndBlock);
    console.log("targetEndPanelBlock: ", targetEndPanelBlock);
    console.log('cardIdStart: ', cardIdStart);
    console.log('cardIdEnd: ', cardIdEnd);
    //! Be careful here
    //start block is where you drag the item
    //end block is where you want to drop the item
    targetStartBlock.appendChild(itemTwo);
    targetEndBlock.appendChild(itemOne);

    //swap the position
    itemOne.value = `${toIndex}`;
    console.log("Finale position of item one : ", itemOne.value);
    itemTwo.value = `${fromIndex}`;
    console.log("Finale position of item two : ", itemTwo.value);

    // dragCard.updateCard(cardIdStart, toIndex);
    // dragCard.updateCard(cardIdEnd, fromIndex);
  },

  //~__________________________ Update cards

  async updateCard(cardId, index) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: index,
        //by default user 1 for now
        user_id: 1
      })
    };

    const response = await fetch(`${url}${allCards}/${cardId}`, options);

    if (response.ok) {
      await response.json();
    }
  }
};

export { dragCard };
