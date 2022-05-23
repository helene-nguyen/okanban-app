const dragList = {
    //^INITIALISATION
    init() {
        dragList.listZone();
    },

    //^METHODS
    //*DRAGGABLE LIST ZONE
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
     }
}

export {
    dragList
}