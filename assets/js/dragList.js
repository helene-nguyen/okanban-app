const dragList = {
    //^INITIALISATION
    init() {
        dragList.eventListeners();
    },

    //^METHODS
    /* //*DRAGGABLE LIST ZONE
    listZone() {
        const listZone = document.getElementById('zone-list');
    
        listZone.addEventListener('drop', dragList.handleOnDropList);
        listZone.addEventListener('drop', dragList.handleOnDragOverList);
    },
    //*DROP 
    handleOnDropList(event) {
        event.preventDefault();
        
    },
    //*DROP OVER
    handleOnDragOverList(event) {
        event.preventDefault();
    },
    handleDragStartList(event) {
        const listOrder = event.target.querySelector('.list-order').value;
        //todo remove
        console.log("I've moved my list");
        console.log(event.target)
        console.log('My list Id is : ', event.target.dataset.listId);
        console.log(`Position of my list is : `, event.target.querySelector('.list-order').value);

        event.dataTransfer.setData('listOrder', listOrder);
        event.dataTransfer.dropEffect = 'move';
     } */
    eventListeners() {
        const draggableList = document.querySelector('.my-list');
        draggableList.addEventListener('dragstart', this.dragStart);
        // console.log("draggableZone: ", draggableZone);
        
        const draggableZone = document.querySelector('.block-to-clone');
        draggableZone.addEventListener('dragenter', this.dragEnter);
        draggableZone.addEventListener('dragleave', this.dragLeave);
        draggableZone.addEventListener('dragover', this.dragOver);
        draggableZone.addEventListener('drop', this.dragDrop);
    },
    //^_______________Dragstart
    dragStart(event) {
        //todo remove after test 
        console.log('Event', 'drag start');
        console.log('Element ciblé', event.target);
        console.log(`L'ordre de la liste : `, event.target.querySelector('.list-order').value);
        const draggedList = event.target;
        setTimeout(() => (draggedList.classList.add('hide-element')), 0);
    },
    dragEnter() {
        console.log('Event', 'drag enter');
        
    },
    dragLeave() {
        console.log('Event', 'drag leave');
        this.classList.remove('drag-over');

    },
    dragOver() {
        // console.log('Event', 'drag over');
        this.classList.add('drag-over');
    },
    dragDrop() {
        // console.log('Event', 'drag drop');
    },

}

export {
    dragList
}