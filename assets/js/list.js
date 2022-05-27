import { cardModule } from "./index.js";
import { url, allLists } from "./index.js";
import { dragList, displayNotification } from "./index.js";

const listModule = {
  async test() {
    const response = await fetch("http://localhost:1337/api/articles");
    if (response.ok) {
      console.log(await response.json());
    }
  },
  //*FETCH ALL LISTS
  async fetchListsFromAPI() {
    //display all lists created
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
      //button remove list
      listModule.buttonRemoveList();
      //get all cards from API
      cardModule.fetchAllCards();
    }
  },

  //*SHOW LIST MODAL
  showAddListModal() {
    //reset all inputs
    document.querySelector(`#addListModal input[name="list_name"]`).value = "";
    document.querySelector(
      `#addListModal input[name="list_description"]`
    ).value =
      "";

    //display list form to create a list
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
    //get all data from list form
    const data = new FormData(event.target);
    const listName = data.get("list_name");
    const listDescription = data.get("list_description");
    const listUser = data.get("list_user");

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

    //use the API to get all lists
    const response = await fetch(`${url}${allLists}`, options);

    if (response.ok) {
      const message = await response.json();
      //can add a notification if you want to
      //displayNotification(message);
      location.reload();
    } else {
      throw new Error("Cannot create this list, server error");
    }

    const buttonAddCard = document.querySelector(".addCardButton");
    buttonAddCard.addEventListener("click", cardModule.showAddCardModal);

    listModule.hideModals();
    //~button remove list
    listModule.buttonRemoveList();
  },
  /**
       * 
       * @param {int} id 
       * @param {string} title name of list
       * @param {string} description 
       * @param {int} user 
       * @param {int} order 
       */
  //*MAKE NEW LIST
  makeListInDOM(id, title, description, user, order) {
    //~clone our list template
    const template = document.querySelector("#template-list");
    const clone = document.importNode(template.content, true);
    const cloneBlockElement = clone.querySelector(".block-to-clone");
    //set datas on our list
    const list = clone.querySelector(".my-list");
    list.setAttribute("data-list-id", `${id}`);
    list.setAttribute("data-order-id", `${order}`);
    list
      .querySelector(".edit-list-form")
      .addEventListener("submit", listModule.handleAddNewListTitle);

    //~append to list board
    const boardLists = document.querySelector(".board-lists");
    boardLists.insertAdjacentElement("afterbegin", cloneBlockElement);
    boardLists.querySelector(".list-title").textContent = title;
    boardLists.querySelector(".list-description").textContent = description;
    boardLists.querySelector(".list-user").setAttribute("value", `${user}`);
    boardLists.querySelector(".list-order").setAttribute("value", `${order}`);

    //~hide form
    listModule.hideModals();
    //~editform
    listModule.editListForm();
    //~handle button remove list
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

  //*BUTTON SHOW REMOVE LIST MODAL
  confirmModalDeleteList(event) {
    //closest can select the closest parent that ave the selected class
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
      const message = await response.json();
      displayNotification(message);
      listModule.hideModalDeleteList();
      //trick to see deletion immediately
      listToRemove.remove();
    } else {
      throw new Error("Cannot delete this list, server error");
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
    //~get info from current list
    const listTitleElement = event.target.closest(".my-list");
    const listId = listTitleElement.dataset.listId;
    let currentTitle = listTitleElement.querySelector(".list-title")
      .textContent;
    let currentDescription = listTitleElement.querySelector(".list-description")
      .textContent;

    //~get info from form list
    const data = new FormData(event.target);

    //if list name or description are not entered, take the current info
    let listName = data.get("list_name");
    listName === "" ? (listName = currentTitle) : listName;

    let listDescription = data.get("list_description");
    listDescription === ""
      ? (listDescription = currentDescription)
      : listDescription;

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
      const message = await response.json();
      //can add a notification if you want to
      //displayNotification(message);
      location.reload();
    } else {
      throw new Error("Cannot edit this list, server error");
    }
  }
};

export { listModule };
