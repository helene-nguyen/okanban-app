const dragList = {
    //^INITIALISATION
    init() {
        dragList.listZone();
    },

    //^METHODS
    //*DRAGGABLE LIST ZONE
    listZone() {
        const listZone = document.getElementById('zone-list');
        //todo remove
        console.log("listZone: ", listZone);

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
        //todo remove
        console.log("J'ai déplacé ma liste");
        console.log(event.target)
        console.log('Mon id List est le : ', event.target.dataset.listId);
        // console.log(`L'ordre de ma List est le : `, event.target.querySelector(''));


     }
}

export {
    dragList
}