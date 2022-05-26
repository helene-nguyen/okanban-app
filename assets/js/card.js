import { listModule, tagModule } from "./index.js";
import { url, allLists, allCards, allTags } from "./index.js";
import { dragList, animationLetters, converter } from "./index.js";

const cardModule = {
  /**
   * 
   * @param {*} event 
   */
  //*SHOW CARD MODAL
  showAddCardModal(event) {
    const listId = event.target.closest(".my-list").dataset.listId;
    //todo remove
    console.log(`Liste choisie = ${listId}`);
    const inputCardListId = (document.querySelector(
      ".card-list-id"
    ).value = listId);
    //todo remove
    console.log(`Carte choisie avec la liste suivante = ${inputCardListId}`);

    document.querySelector(`#addCardModal input[name="card_title"]`).value = "";
    document.querySelector(
      `#addCardModal input[name="card_description"]`
    ).value =
      "";

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

    const data = new FormData(event.target);

    const cardTitle = data.get("card_title");
    const cardDescription = data.get("card_description");
    const cardColor = data.get("card_color");
    const cardOrder = data.get("card_order");
    const cardUser = data.get("card_user");
    const listId = data.get("list_id");
    //todo remove
    console.log(`Titre de la nouvelle carte = ${cardTitle}`);
    console.log(`Description = ${cardDescription}`);
    console.log(`Couleur = ${cardColor}`);
    console.log(`Position de la carte = ${cardOrder}`);
    console.log(`Utilisateur = ${cardUser}`);
    console.log(`List id récupérée = ${listId}`);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: cardTitle,
        description: cardDescription,
        color: cardColor,
        order: cardOrder,
        user_id: cardUser,
        list_id: listId
      })
    };

    const response = await fetch(`${url}${allCards}`, options);

    if (response.ok) {
      const cardMessage = await response.json();
      console.log("cardMessage: ", cardMessage);
      /* cardModule.makeCardInDOM('', cardTitle, cardDescription, cardColor, listId, cardOrder, cardUser); */
      location.reload();
    }
  },
  /**
   * 
   * @param {string} cardInfo info card
   * @param {string} cardDescription 
   * @param {string} color 
   * @param {int} listId id of list
   */
  //*MAKE NEW CARD
  makeCardInDOM(
    cardId,
    cardInfo,
    cardDescription,
    color,
    listId,
    cardOrder,
    cardUser
  ) {
    //~Cloning template
    const template = document.querySelector("#template-card");

    const clone = document.importNode(template.content, true);
    const card = clone.querySelector(".myCard");
    card.setAttribute("data-card-id", `${cardId}`);
    //~set data cards id
    card.querySelector(".card-info").textContent = cardInfo;
    card.querySelector(".card-description").textContent = cardDescription;
    card.querySelector(".card-order").value = cardOrder;
    card.querySelector(".card-user").value = cardUser;
    card.querySelector(".card-list-id").value = listId;
    card.style.borderTop = `4px solid`;
    //color in HEX
    card.style.borderTopColor = color;

    document
      .querySelector(`[data-list-id="${listId}"]`)
      .querySelector(".panel-block")
      .insertAdjacentElement("afterbegin", card);
    //todo put cardId
    cardModule.hideModalCard();
    cardModule.buttonEditCard();
    cardModule.buttonRemoveCard();

    const cardsElement = document.querySelectorAll(
      `[data-card-id="${cardId}"]`
    );

    for (const card of cardsElement) {
      //todo get all form tags for handle add tags
      card
        .querySelector("#container-new-tag")
        .addEventListener("submit", event => {
          event.preventDefault();
          tagModule.handleAddTagsForm(cardId, event);
        });
    }
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
    const cardToRemove = event.target.closest(".myCard");
    const cardId = cardToRemove.dataset.cardId;

    const confirmDeleteBtnElement = document.querySelector("#removeModal");
    confirmDeleteBtnElement.classList.add("is-active");
    confirmDeleteBtnElement.querySelector(".card-id").value = cardId;
    confirmDeleteBtnElement
      .querySelector(".form-delete")
      .addEventListener("submit", cardModule.buttonConfirmDeleteCard);

    listModule.closeModalDeleteBtn();
  },
  //*BUTTON CONFIRM DELETE
  async buttonConfirmDeleteCard(event) {
    event.preventDefault();

    const cardIdToRemove = document
      .querySelector("#removeModal")
      .querySelector(".card-id").value;
    console.log("cardIdToRemove: ", cardIdToRemove);
    const cardToRemove = document.querySelector(
      `[data-card-id="${cardIdToRemove}"]`
    );

    const options = {
      method: "DELETE"
    };

    const response = await fetch(
      `${url}${allCards}/${cardIdToRemove}`,
      options
    );

    if (response.ok) {
      const deleteCard = await response.json();
      console.log(deleteCard);
      listModule.hideModalDeleteList();
      //trick to see deletion immediately
      cardToRemove.remove();
      /* alert(deleteCard); */
      /*  location.reload(); */
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
    const cardElement = event.target.closest(".myCard");
    const cardId = cardElement.dataset.cardId;
    const listId = cardElement.querySelector(".card-list-id").value;
    const cardOrder = cardElement.querySelector(".card-order").value;
    const cardUser = cardElement.querySelector(".card-user").value;
    //color
    let currentColorCard = cardElement.style.borderTopColor;
    console.log("___________________________________");
    console.log("currentColorCard: ", currentColorCard);
    let valueRGB = currentColorCard.split("(")[1].split(")")[0];
    console.log("valueRGB: ", valueRGB);
    currentColorCard = converter.getHexFromRGB(valueRGB);

    //todo remove
    console.log("currentColorCard: ", currentColorCard);
    console.log("cardId choisie pour modif: ", cardId);
    console.log("listId choisie pour modif: ", listId);
    console.log("cardOrder choisie pour modif: ", cardOrder);
    console.log("cardUser choisie pour modif: ", cardUser);

    cardModule.showEditCardModal(
      cardId,
      listId,
      cardOrder,
      cardUser,
      currentColorCard
    );

    //~valid form card
    document
      .querySelector("#form-edit-card")
      .addEventListener("submit", cardModule.handleEditCardForm);
  },
  //*SHOW EDIT CARD MODAL
  showEditCardModal(cardId, listId, cardOrder, cardUser, currentColor) {
    document.querySelector(`#editCardModal input[name="card_edit"]`).value = "";
    document.querySelector(
      `#editCardModal input[name="card_description"]`
    ).value =
      "";

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
    const targetCardElement = document.querySelector(
      `[data-card-id="${cardId}"]`
    );
    //CURRENT CARD
    const currentTitleCard = targetCardElement.querySelector(".card-info")
      .textContent;
    const currentDescriptionCard = targetCardElement.querySelector(
      ".card-description"
    ).textContent;

    let currentColorCard = targetCardElement.style.borderTopColor;
    let valueRGB = currentColorCard.split("(")[1].split(")")[0];
    currentColorCard = converter.getHexFromRGB(valueRGB);

    //todo remove after test
    console.log("_______________________________________________");
    console.log("valueRGB: ", valueRGB);
    console.log("currentTitleCard: ", currentTitleCard);
    console.log("currentDescriptionCard: ", currentDescriptionCard);
    console.log("currentColorCard: ", currentColorCard); //first in RGB
    console.log("_______________________________________________");
    // console.log("cardId modifiée: ", cardId);
    // console.log("Carte visée: ", targetCardElement);

    const data = new FormData(event.target);

    //!condition if modify only one value
    let cardEdit = data.get("card_edit");
    let cardDescription = data.get("card_description");
    let cardColor = data.get("card_color");

    cardEdit === "" ? (cardEdit = currentTitleCard) : cardEdit;
    cardDescription === ""
      ? (cardDescription = currentDescriptionCard)
      : cardDescription;
    cardColor === "" ? (cardColor = currentColorCard) : cardColor;

    const cardOrder = data.get("card_order");
    const listId = data.get("list_id");
    //todo remove
    console.log(`Titre de la nouvelle carte = ${cardEdit}`);
    console.log(`Description de la nouvelle carte = ${cardDescription}`);
    console.log(`Couleur de la nouvelle carte = ${cardColor}`);
    console.log(`Ordre = ${cardOrder}`);
    console.log(`La liste = ${listId}`);

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
      const updateCard = await response.json();
      console.log(updateCard);

      targetCardElement.querySelector(".card-info").textContent = cardEdit;
      targetCardElement.querySelector(
        ".card-description"
      ).textContent = cardDescription;
      targetCardElement.style.borderTop = `4px solid ${cardColor}`;

      cardModule.hideEditModalCard();
    }
  },

  //*FETCH ALL CARDS BY LIST ID
  async fetchAllCards() {
    const response = await fetch(`${url}${allCards}`);

    if (response.ok) {
      const cards = await response.json();

      for (const card of cards) {
        cardModule.makeCardInDOM(
          card.id,
          card.title,
          card.description,
          card.color,
          card.list_id,
          card.order,
          card.user_id
        );
        tagModule.fetchAllTagsByCardId(card.id);
      }

      cardModule.buttonRemoveCard();
    }
  }
};

export { cardModule };
