//~import modules
import { dragCard } from "./drag_drop/card.js";
import { listModule, tagModule, url, allCards, converter } from "./index.js";
import { displayNotification } from "./utils.js";

const cardModule = {
  //*FETCH ALL CARDS BY LIST ID
  async fetchAllCards() {
    const response = await fetch(`${url}${allCards}`);

    if (response.ok) {
      const cards = await response.json();

      for (const card of cards) {
        cardModule.makeCardInDOM(card.id, card.title, card.description, card.color, card.list_id, card.order, card.user_id);

        tagModule.fetchAllTagsByCardId(card.id);
      }
      cardModule.buttonRemoveCard();
    }
  },
  /**
     * 
     * @param {*} event 
     */
  //*SHOW CARD MODAL
  showAddCardModal(event) {
    const listId = event.target.closest(".my-list").dataset.listId;
    //add data attribute
    document.querySelector(".card-list-id").value = listId;
    //reset info in inputs
    document.querySelector(`#addCardModal input[name='card_title']`).value = "";
    document.querySelector(`#addCardModal input[name='card_description']`).value = "";

    const modalElement = document.getElementById("addCardModal");
    modalElement.classList.add("is-active");
    modalElement.querySelector(".card-list-id").value = listId;
  },

  //*HIDE CARD MODAL
  hideModalCard() {
    const modalElement = document.getElementById("addCardModal");
    modalElement.classList.remove("is-active");
  },

  /**
     * 
     * @param {*} event valid form
     */
  //*HANDLE CARD FORM
  async handleAddCardForm(event) {
    event.preventDefault();
    //get datas from card form
    const data = new FormData(event.target);

    const cardTitle = data.get("card_title");
    const cardDescription = data.get("card_description");
    const cardColor = data.get("card_color");
    const cardUser = data.get("card_user");
    const listId = data.get("list_id");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: cardTitle,
        description: cardDescription,
        color: cardColor,
        user_id: cardUser,
        list_id: listId
      })
    };

    const response = await fetch(`${url}${allCards}`, options);

    if (response.ok) {
      await response.json();
      //refresh page
      location.reload();
    }

    throw new Error("Cannot create this card, server error");
  },
  /**
   * 
   * @param {int} cardId id card
   * @param {string} cardInfo name of card
   * @param {string} cardDescription description of card
   * @param {string} color 
   * @param {int} listId 
   * @param {int} cardOrder 
   * @param {int} cardUser 
   */
  //*MAKE NEW CARD
  makeCardInDOM(cardId, cardInfo, cardDescription, color, listId, cardOrder, cardUser) {
    //~Cloning template
    const template = document.querySelector("#template-card");
    const clone = document.importNode(template.content, true);
    const cloneBlockElement = clone.querySelector(".card-block-to-clone");
    const card = clone.querySelector(".my-card");
    //~set data cards id
    card.setAttribute("data-card-id", `${cardId}`);
    //~set info card
    card.querySelector(".card-info").textContent = cardInfo + ` [ order ${cardOrder} ]`;
    card.querySelector(".card-description").textContent = cardDescription;
    card.querySelector(".card-order").value = cardOrder;
    card.querySelector(".card-user").value = cardUser;
    card.querySelector(".card-list-id").value = listId;
    card.style.borderTop = `4px solid`;
    //color in HEX
    card.style.borderTopColor = color;

    document.querySelector(`[data-list-id='${listId}']`).querySelector(".panel-block").insertAdjacentElement("afterbegin", cloneBlockElement);

    cardModule.hideModalCard();
    cardModule.buttonEditCard();
    cardModule.buttonRemoveCard();

    const cardsElement = document.querySelectorAll(`[data-card-id='${cardId}']`);

    for (const card of cardsElement) {
      card.querySelector("#container-new-tag").addEventListener("submit", event => {
        event.preventDefault();
        //for each card, we want to add tags
        tagModule.handleAddTagsForm(cardId, event);
      });
    }

    //~handle drag and drop cards
    dragCard.init();
  },

  //*BUTTON REMOVE CARD
  buttonRemoveCard() {
    const buttonsRemoveCard = document.querySelectorAll(".remove-card");

    for (const buttonRemove of buttonsRemoveCard) {
      buttonRemove.addEventListener("click", cardModule.confirmModalDeleteCard);
    }
  },

  //*BUTTON SHOW MODAL REMOVE CARD
  confirmModalDeleteCard(event) {
    const cardToRemove = event.target.closest(".my-card");
    const cardId = cardToRemove.dataset.cardId;

    //add pop up window to confirm deletion
    const confirmDeleteBtnElement = document.querySelector("#removeModal");
    confirmDeleteBtnElement.classList.add("is-active");
    confirmDeleteBtnElement.querySelector(".card-id").value = cardId;
    confirmDeleteBtnElement.querySelector(".form-delete").addEventListener("submit", cardModule.buttonConfirmDeleteCard);

    listModule.closeModalDeleteBtn();
  },

  //*BUTTON CONFIRM DELETE
  async buttonConfirmDeleteCard(event) {
    event.preventDefault();

    const cardIdToRemove = document.querySelector("#removeModal").querySelector(".card-id").value;

    const cardToRemove = document.querySelector(`[data-card-id='${cardIdToRemove}']`);

    const options = {
      method: "DELETE"
    };

    const response = await fetch(`${url}${allCards}/${cardIdToRemove}`, options);

    if (response.ok) {
      const message = await response.json();
      displayNotification(message);
      listModule.hideModalDeleteList();
      //trick to see deletion immediately
      cardToRemove.remove();
    } else {
      throw new Error("Cannot delete this card, server error");
    }
  },

  //*BUTTON EDIT CARD
  buttonEditCard() {
    const buttonsEditCard = document.querySelectorAll(".edit-card");

    for (const buttonEdit of buttonsEditCard) {
      buttonEdit.addEventListener("click", cardModule.editCard);
    }
  },

  //*DO EDIT CARD
  editCard(event) {
    const cardElement = event.target.closest(".my-card");
    const cardId = cardElement.dataset.cardId;
    const listId = cardElement.querySelector(".card-list-id").value;
    const cardOrder = cardElement.querySelector(".card-order").value;
    const cardUser = cardElement.querySelector(".card-user").value;
    //~color
    let currentColorCard = cardElement.style.borderTopColor;
    //convert RGB color in Hex color
    let valueRGB = currentColorCard.split("(")[1].split(")")[0];
    currentColorCard = converter.getHexFromRGB(valueRGB);

    cardModule.showEditCardModal(cardId, listId, cardOrder, cardUser, currentColorCard);

    //~valid form card
    document.querySelector("#form-edit-card").addEventListener("submit", cardModule.handleEditCardForm);
  },
  /**
   * 
   * @param {int} cardId 
   * @param {int} listId 
   * @param {int} cardOrder 
   * @param {int} cardUser 
   * @param {string} currentColor 
   */
  //*SHOW EDIT CARD MODAL
  showEditCardModal(cardId, listId, cardOrder, cardUser, currentColor) {
    document.querySelector(`#editCardModal input[name='card_edit']`).value = "";
    document.querySelector(`#editCardModal input[name='card_description']`).value = "";

    const editModalElement = document.getElementById("editCardModal");

    editModalElement.classList.add("is-active");
    editModalElement.querySelector(".card-id").value = cardId;
    editModalElement.querySelector(".card-order").value = cardOrder;
    editModalElement.querySelector(".card-user").value = cardUser;
    editModalElement.querySelector(".list-id").value = listId;
    editModalElement.querySelector(".card-color").value = currentColor;
  },

  //*HIDE EDIT CARD MODAL
  hideEditModalCard() {
    const modalElement = document.getElementById("editCardModal");
    modalElement.classList.remove("is-active");
  },

  //*HANDLE EDIT CARD FORM MODAL
  async handleEditCardForm(event) {
    event.preventDefault();

    const cardId = event.target.querySelector(".card-id").value;
    const targetCardElement = document.querySelector(`[data-card-id='${cardId}']`);
    //info current card
    const currentTitleCard = targetCardElement.querySelector(".card-info").textContent;
    const currentDescriptionCard = targetCardElement.querySelector(".card-description").textContent;
    //convert RGB to Hex
    let currentColorCard = targetCardElement.style.borderTopColor;
    let valueRGB = currentColorCard.split("(")[1].split(")")[0];
    currentColorCard = converter.getHexFromRGB(valueRGB);

    //get info from edit card form
    const data = new FormData(event.target);

    //!condition if modify only one value
    const cardOrder = data.get("card_order");
    let cardEdit = data.get("card_edit");
    let cardDescription = data.get("card_description");
    let cardColor = data.get("card_color");

    cardEdit === "" ? (cardEdit = currentTitleCard) : cardEdit;
    cardDescription === "" ? (cardDescription = currentDescriptionCard) : cardDescription;
    cardColor === "" ? (cardColor = currentColorCard) : cardColor;

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: cardEdit,
        description: cardDescription,
        color: cardColor,
        order: cardOrder
      })
    };

    const response = await fetch(`${url}${allCards}/${cardId}`, options);

    if (response.ok) {
      await response.json();

      targetCardElement.querySelector(".card-info").textContent = cardEdit;
      targetCardElement.querySelector(".card-description").textContent = cardDescription;
      targetCardElement.style.borderTop = `4px solid ${cardColor}`;

      cardModule.hideEditModalCard();
    } else {
      throw new Error("Cannot edit this card, server error");
    }
  }
};

export { cardModule };
