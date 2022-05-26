const dragList = {
    //^VARIABLES
    dragStartIndex: '',
    //^INITIALISATION
    init() {
        dragList.eventListeners();
    },

    //^METHODS
    eventListeners() {
        const draggableList = document.querySelector('.my-list');
        draggableList.addEventListener('dragstart', this.dragStart);

        const draggableZone = document.querySelector('.block-to-clone');
        draggableZone.addEventListener('dragenter', this.dragEnter);
        draggableZone.addEventListener('dragleave', this.dragLeave);
        draggableZone.addEventListener('dragover', this.dragOver);
        draggableZone.addEventListener('drop', this.dragDrop);
    },
    //^_______________Dragstart
    dragStart(event) {

        const draggedList = event.target;
        //the + symbol make it a Number
        dragList.dragStartIndex = +this.closest('.my-list').getAttribute('data-order-id');

        //todo remove after test 
        console.log("orderId: ", dragList.dragStartIndex);
        console.log('Event', 'drag start');
        console.log('Element ciblé', event.target);
        console.log(`L'ordre de la liste : `, event.target.querySelector('.list-order').value);

        event.dataTransfer.dropEffect = 'move';
        //
        setTimeout(() => (draggedList.classList.add('hide-element')), 0);
    },
    dragEnter(event) {
        event.preventDefault();
        this.classList.add('drag-over');

        console.log('Event', 'drag enter');
    },
    dragLeave() {
        this.classList.remove('drag-over');
        
        console.log('Event', 'drag leave');
    },
    dragOver(event) {
        event.preventDefault();
        this.classList.add('drag-over');
    },
    dragDrop(event) {
        const dragEndIndex = +this.querySelector('.my-list').getAttribute('data-order-id');
        
        dragList.swapItems(dragList.dragStartIndex, dragEndIndex, event);
        
        this.classList.remove('drag-over');
        
        //todo swaping
        console.log('Event', 'drag drop');
        console.log("dragEndIndex: ", dragEndIndex);
        console.log("dragList.dragStartIndex: ", dragList.dragStartIndex);
    },
    /**
     * 
     * @param {int} fromIndex where to start
     * @param {int} toIndex where to end
     * @param {*} event 
     */
    swapItems(fromIndex, toIndex, event) {
        const targetEndBlock = event.target.closest('.block-to-clone');
        const itemOne = document.querySelector(`[data-order-id="${fromIndex}"]`);
        itemOne.classList.remove('hide-element');
        const itemTwo = document.querySelector(`[data-order-id="${toIndex}"]`);
        const targetStartBlock = itemOne.parentNode;
        //! Be careful here
        const listIdStartBlock = targetEndBlock.querySelector('.my-list').getAttribute('data-list-id');
        const listIdEndBlock = targetStartBlock.querySelector('.my-list').getAttribute('data-list-id');
        
        targetStartBlock.appendChild(itemTwo);
        targetEndBlock.appendChild(itemOne);


        
        //todo remove
        console.log("targetStartBlock: ", targetStartBlock);
        console.log("listIdStartBlock: ", listIdStartBlock);
        console.log("targetEndBlock", targetEndBlock);
        console.log("listIdEndBlock: ", listIdEndBlock);
        console.log("itemOne: ", itemOne);
        console.log("itemTwo: ", itemTwo);
    }
}

export {
    dragList
}