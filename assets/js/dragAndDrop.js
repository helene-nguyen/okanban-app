//~import module
import { url, allLists } from "./services/api.okanban.js";

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
    //place where we can drop
    const draggableZone = document.querySelector(".block-to-clone");
    draggableZone.addEventListener("dragenter", this.dragEnter);
    draggableZone.addEventListener("dragleave", this.dragLeave);
    draggableZone.addEventListener("dragover", this.dragOver);
    draggableZone.addEventListener("drop", this.dragDrop);
  },

  //~__________________________ Dragstart
  dragStart(event) {
    //target the list we can to drag
    const draggedList = event.target;
    //the + symbol make it a Number
    dragList.dragStartIndex = +this.closest(".my-list").getAttribute("data-order-id");

    event.dataTransfer.dropEffect = "move";
    //when we drag the element, we want to make it disappear
    setTimeout(() => draggedList.classList.add("hide-element"), 0);
  },

  //~__________________________ DragEnter
  dragEnter(event) {
    event.preventDefault();
    this.classList.add("drag-over");
  },

  //~__________________________ DragLeave
  dragLeave() {
    this.classList.remove("drag-over");
  },

  //~__________________________ DragOver
  dragOver(event) {
    event.preventDefault();
    this.classList.add("drag-over");
  },

  //~__________________________ DragDrop
  dragDrop(event) {
    const dragEndIndex = +this.querySelector(".my-list").getAttribute("data-order-id");

    dragList.swapItems(dragList.dragStartIndex, dragEndIndex, event);

    this.classList.remove("drag-over");
  },

  //~__________________________ Swap items
  /**
     * 
     * @param {int} fromIndex where to start
     * @param {int} toIndex where to end
     * @param {*} event 
     */
  swapItems(fromIndex, toIndex, event) {
    const itemOne = document.querySelector(`[data-order-id="${fromIndex}"]`);
    itemOne.classList.remove("hide-element");
    const itemTwo = document.querySelector(`[data-order-id="${toIndex}"]`);
    const targetEndBlock = event.target.closest(".block-to-clone");
    const targetStartBlock = itemOne.parentNode;

    const listIdStart = targetStartBlock
      .querySelector(".my-list")
      .getAttribute("data-list-id");

    const listIdEnd = targetEndBlock
      .querySelector(".my-list")
      .getAttribute("data-list-id");
    //! Be careful here
    //start block is where you drag the item
    //end block is where you want to drop the item
    targetStartBlock.appendChild(itemTwo);
    targetEndBlock.appendChild(itemOne);

    //swap the position
    itemOne.setAttribute("data-order-id", `${toIndex}`);
    itemTwo.setAttribute("data-order-id", `${fromIndex}`);

    dragList.updateStartList(listIdStart, toIndex);
    dragList.updateEndList(listIdEnd, fromIndex);
  },

  //~__________________________ Update lists

  async updateStartList(listIdStart, toIndex) {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order: toIndex,
        //by default user 1 for now
        user_id: 1
      })
    };

    const response = await fetch(`${url}${allLists}/${listIdStart}`, options);

    if (response.ok) {
      await response.json();
    }
  },

  async updateEndList(listIdEnd, fromIndex) {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order: fromIndex,
        //by default user 1 for now
        user_id: 1
      })
    };

    const response = await fetch(`${url}${allLists}/${listIdEnd}`, options);

    if (response.ok) {
      await response.json();
    }
  }
};

export { dragList };
