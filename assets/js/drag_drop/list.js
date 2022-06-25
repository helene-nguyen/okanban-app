//~import module
import { url, allLists } from "../services/api.okanban.js";

const dragList = {
  //^VARIABLES
  dragStartIndex: "",

  //^INITIALISATION
  init() {
    dragList.eventListeners();
  },

  //^METHODS
  eventListeners() {
    //item we can drag
    const draggableList = document.querySelector(".my-list");
    draggableList.addEventListener("dragstart", this.dragStart);
    draggableList.addEventListener("dragend", this.dragEnd);
    //place where we can drop
    const draggableZone = document.querySelector(".block-to-clone");
    draggableZone.addEventListener("dragenter", this.dragEnter);
    draggableZone.addEventListener("dragleave", this.dragLeave);
    draggableZone.addEventListener("dragover", this.dragOver);
    draggableZone.addEventListener("drop", this.dragDrop);
  },
  //*________________ DRAGGABLE LIST _________________*/
  //~__________________________ Dragstart
  dragStart(event) {
      //avoid to select the list
      event.stopPropagation();
    //target the list we want to drag
    const draggedList = event.currentTarget;

    //the + symbol make it a Number
    dragList.dragStartIndex = +this.closest(".my-list").getAttribute("data-order-id");

    // event.dataTransfer.dropEffect = "move";
    //when we drag the element, we want to make it disappear
    setTimeout(() => draggedList.classList.add("hide-element"), 0);
  },
  dragEnd(event) {
    //avoid to select the card
    event.stopPropagation();
    this.classList.remove("hide-element");
  },
  //*________________ DRAGGABLE ZONE LIST _________________*/
  //~__________________________ DragEnter
  dragEnter(event) {
    //avoid to select the card
    event.stopPropagation();
    event.preventDefault();
    this.classList.add("drag-over");
  },

  //~__________________________ DragLeave
  dragLeave() {
    this.classList.remove("drag-over");
    this.style.opacity = "1";
    this.style.transition = "0.5s ease-in-out";
  },

  //~__________________________ DragOver
  dragOver(event) {
    //avoid to select the card
    event.stopPropagation();
    event.preventDefault();
    this.classList.add("drag-over");
  },

  //~__________________________ DragDrop
  dragDrop(event) {
    //avoid to select the card
    event.stopPropagation();
    const dragEndIndex = +this.querySelector(".my-list").getAttribute("data-order-id");

    dragList.swapItems(dragList.dragStartIndex, dragEndIndex, event);

    this.classList.remove("drag-over");
    this.style.opacity = "1";
  },

  //~__________________________ Swap items
  /**
     * 
     * @param {int} fromIndex where to start
     * @param {int} toIndex where to end
     * @param {*} event 
     */
  swapItems(fromIndex, toIndex, event) {
    const itemOne = document.querySelector(`[data-order-id='${fromIndex}']`);
    itemOne.classList.remove("hide-element");
    const itemTwo = document.querySelector(`[data-order-id='${toIndex}']`);
    const targetEndBlock = event.target.closest(".block-to-clone");
    const targetStartBlock = itemOne.parentNode;

    const listIdStart = targetStartBlock.querySelector(".my-list").getAttribute("data-list-id");

    const listIdEnd = targetEndBlock.querySelector(".my-list").getAttribute("data-list-id");
    //! Be careful here
    //start block is where you drag the item
    //end block is where you want to drop the item
    targetStartBlock.appendChild(itemTwo);
    targetEndBlock.appendChild(itemOne);

    //swap the position
    itemOne.setAttribute("data-order-id", `${toIndex}`);
    itemTwo.setAttribute("data-order-id", `${fromIndex}`);

    dragList.updateList(listIdStart, toIndex);
    dragList.updateList(listIdEnd, fromIndex);
  },

  //~__________________________ Update lists

  async updateList(listId, index) {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order: index,
        //by default user 1 for now
        user_id: 1
      })
    };

    const response = await fetch(`${url}${allLists}/${listId}`, options);

    if (response.ok) {
      await response.json();
    }
  }
};

export { dragList };

//Thank you Traversy Media for tuto https://www.youtube.com/watch?v=wv7pvH1O5Ho
