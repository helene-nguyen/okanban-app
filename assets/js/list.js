import { cardModule } from "./index.js";
import { url, allLists, allCards, allTags } from "./index.js";
import { dragList, animationLetters, converter } from "./index.js";

const listModule = {
 //*FETCH ALL LISTS
 async fetchListsFromAPI() {
    const response = await fetch(`${url}${allLists}`);

    if (response.ok) {
      const lists = await response.json();

      for (const list of lists) {
        listModule.makeListInDOM(
          list.id,
          list.title,
          list.description,
          list.user_id,
          list.order
        );
      }

      const buttonsAddCard = document.querySelectorAll(".addCardButton");

      for (const button of buttonsAddCard) {
        button.addEventListener("click", cardModule.showAddCardModal);
      }
      //~button remove list
      listModule.buttonRemoveList();
      cardModule.fetchAllCards();
    }
  },
  //*SHOW LIST MODAL
  showAddListModal() {
    document.querySelector(`#addListModal input[name="list_name"]`).value = "";
    document.querySelector(
      `#addListModal input[name="list_description"]`
    ).value =
      "";

    const modalElement = document.getElementById("addListModal");
    modalElement.classList.add("is-active");
  },
  //*HIDE MODALS
  hideModals() {
    const modalElement = document.getElementById("addListModal");
    modalElement.classList.remove("is-active");
  },
  //*HANDLE LIST FORM
  async handleAddListForm(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const listName = data.get("list_name");
    const listDescription = data.get("list_description");
    const listUser = data.get("list_user");
    //REMOVE TEST
    console.log(`List name = ${listName}`);
    console.log(`List description = ${listDescription}`);
    console.log(`List user = ${listUser}`);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: listName,
        description: listDescription,
        user_id: listUser
      })
    };

    const response = await fetch(`${url}${allLists}`, options);

    if (response.ok) {
      const listMessage = await response.json();
      //todo remove
      console.log("listMessage: ", listMessage);
      location.reload();
    }

    const buttonAddCard = document.querySelector(".addCardButton");
    buttonAddCard.addEventListener("click", cardModule.showAddCardModal);

    listModule.hideModals();
    //~button remove list
    listModule.buttonRemoveList();
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
    const template = document.querySelector("#template-list");
    const clone = document.importNode(template.content, true);
    const cloneBlockElement = clone.querySelector(".block-to-clone");
    const list = clone.querySelector(".my-list");
    list.setAttribute("data-list-id", `${id}`);
    list.setAttribute("data-order-id", `${order}`);
    list
      .querySelector(".edit-list-form")
      .addEventListener("submit", listModule.handleAddNewListTitle);

    //~append to list board
    const cardLists = document.querySelector(".card-lists");
    cardLists.insertAdjacentElement("afterbegin", cloneBlockElement);
    cardLists.querySelector(".list-title").textContent = title;
    cardLists.querySelector(".list-description").textContent = description;
    cardLists.querySelector(".list-user").setAttribute("value", `${user}`);
    cardLists.querySelector(".list-order").setAttribute("value", `${order}`);

    listModule.hideModals();
    listModule.editListForm();

    //~button remove list
    listModule.buttonRemoveList();
    //~listener for drag list
    dragList.eventListeners();
  },

  //*BUTTON REMOVE LIST
  buttonRemoveList() {
    const buttonsRemoveList = document.querySelectorAll(".deleteListButton");

    for (const buttonRemove of buttonsRemoveList) {
      buttonRemove.addEventListener("click", listModule.confirmModalDeleteList);
    }
  },
  //*BUTTON SHOW MODAL REMOVE LIST
  confirmModalDeleteList(event) {
    const listToRemove = event.target.closest(".my-list");
    const listId = listToRemove.dataset.listId;

    const confirmDeleteBtnElement = document.querySelector("#removeModal");
    confirmDeleteBtnElement.classList.add("is-active");
    confirmDeleteBtnElement.querySelector(".list-id").value = listId;
    confirmDeleteBtnElement
      .querySelector(".form-delete")
      .addEventListener("submit", listModule.buttonConfirmDeleteList);

    listModule.closeModalDeleteBtn();
  },
  //*BUTTON CONFIRM DELETE
  async buttonConfirmDeleteList(event) {
    event.preventDefault();

    const listIdToRemove = document
      .querySelector("#removeModal")
      .querySelector(".list-id").value;
    const listToRemove = document.querySelector(
      `[data-list-id="${listIdToRemove}"]`
    );

    const options = {
      method: "DELETE"
    };

    const response = await fetch(
      `${url}${allLists}/${listIdToRemove}`,
      options
    );

    if (response.ok) {
      const deleteList = await response.json();
      //todo remove
      console.log(deleteList);

      listModule.hideModalDeleteList();
      //trick to see deletion immediately
      listToRemove.remove();
    }
  },
  //*BUTTON CLOSE MODAL REMOVE LIST
  closeModalDeleteBtn() {
    const confirmDeleteBtnElement = document.querySelector("#removeModal");
    const closeButtons = confirmDeleteBtnElement.querySelectorAll(".close");

    for (const button of closeButtons) {
      button.addEventListener("click", listModule.hideModalDeleteList);
    }
  },
  //*HIDE MODAL REMOVE LIST
  hideModalDeleteList() {
    const confirmDeleteBtnElement = document.querySelector("#removeModal");
    confirmDeleteBtnElement.classList.remove("is-active");
  },

  //*EDIT FORM LIST
  editListForm() {
    const listsTitleElement = document.querySelectorAll(".list-title");

    for (const listsTitle of listsTitleElement) {
      listsTitle.addEventListener("click", listModule.displayEditListForm);
    }
  },
  //*DISPLAY EDIT FORM LIST
  displayEditListForm(event) {
    const targetList = event.target.closest(`[data-list-id]`);
    targetList
      .querySelector(".list-description")
      .classList.toggle("display-none");
    const listButtons = targetList.querySelectorAll(".list-btn");

    for (const listButton of listButtons) {
      listButton.classList.toggle("display-none");
    }

    const editListFormElement = targetList.querySelector(".edit-list-form");
    editListFormElement.classList.toggle("is-hidden");
    editListFormElement.querySelector(".new-list").value = "";
    editListFormElement.querySelector(".new-description").value = "";
  },
  //*HANDLE EDIT FORM LIST
  async handleAddNewListTitle(event) {
    event.preventDefault();
    const listTitleElement = event.target.closest(".my-list");
    const listId = listTitleElement.dataset.listId;
    const currentTitle = listTitleElement.querySelector(".list-title")
      .textContent;
    const currentDescription = listTitleElement.querySelector(
      ".list-description"
    ).textContent;
    //todo remove after test
    console.log("Titre actuel : ", currentTitle);
    console.log("Description actuelle : ", currentDescription);

    const data = new FormData(event.target);

    let listName = data.get("list_name");
    listName === "" ? (listName = currentTitle) : listName;
    console.log("Le nom de la liste éditée : ", listName);
    let listDescription = data.get("list_description");
    console.log("La description éditée : ", listDescription);

    const listOrder = data.get("list_order");
    const listUser = data.get("list_user");

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: listName,
        description: listDescription,
        order: listOrder,
        user_id: listUser
      })
    };

    const response = await fetch(`${url}${allLists}/${listId}`, options);

    if (response.ok) {
      const updateList = await response.json();
      //todo remove
      console.log(updateList);
      location.reload();
    }
  },
};

export { listModule };