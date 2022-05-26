import { listModule, cardModule } from "./index.js";
import { url, allLists, allCards, allTags } from "./index.js";
import { dragList, animationLetters, converter } from "./index.js";

const tagModule = {
 //*HANDLE TAG FORM
 async handleAddTagsForm(cardId, event) {
    const tagElement = event.target.closest(".tag-box");
    let currentTags = tagElement.querySelectorAll(".tag-name");
    console.log("currentTagName: ", currentTags);

    //if tag name existe, rechercher tagid pour faire un patch
    //review queryselector all id of tag on card
    //get data from form
    const data = new FormData(event.target);
    let tagName = data.get("new_tag");
    let tagColor = data.get("color_tag");

    //todo remove
    console.log("La couleur de mon tag choisi : ", tagColor);
    console.log("Le nom de mon tag: ", tagName);
    console.log("La carte que j'ai choisi pour modifier le tag", cardId);

    if (currentTags) {
      let tags = [];

      for (let currentTag of currentTags) {
        currentTag = {
          tagName: currentTag.textContent,
          id: currentTag.dataset.tagId
        };
        tags.push(currentTag);
      }
      //todo remove after test
      console.log(tags);

      for (const tag of tags) {
        //todo remove after test
        console.log(tag);

        if (tag.tagName === tagName) {
          let tagId = tag.id;
          //todo remove after test
          console.log("tagId: ", tagId);

          let options = {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: tagName,
              color: tagColor
            })
          };

          const response = await fetch(`${url}${allTags}/${tagId}`, options);

          if (response.ok) {
            const tagMessage = await response.json();
            //todo remove after test
            console.log("tagMessage: ", tagMessage);

            location.reload();
          }
        }
      }
    }

    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: tagName,
        color: tagColor
      })
    };

    const response = await fetch(
      `${url}${allCards}/${cardId}${allTags}/${tagName}`,
      options
    );

    if (response.ok) {
      const tagMessage = await response.json();
      console.log("tagMessage: ", tagMessage);
      /* tagModule.makeTagInDOM('', tagName, tagColor, cardId); */
      /* Reloading the page. */
      location.reload();
    }
  },
  /**
   * 
   * @param {*} cardId 
   */
  //*FETCH ALL TAGS BY CARD ID
  async fetchAllTagsByCardId(cardId) {
    const response = await fetch(`${url}${allCards}/${cardId}/tags`);

    if (response.ok) {
      const tags = await response.json();

      for (const tag of tags) {
        tagModule.makeTagInDOM(tag.id, tag.name, tag.color, cardId);
      }
    }
  },
  /**
   * 
   * @param {*} tagId 
   * @param {*} tagName 
   * @param {*} tagColor 
   * @param {*} cardId 
   */
  //* MAKE TAGS
  async makeTagInDOM(tagId, tagName, tagColor, cardId) {
    //~Cloning template
    const template = document.querySelector("#template-tag");

    const clone = document.importNode(template.content, true);
    const tag = clone.querySelector(".tag-element");
    //~set data tags id
    tag.querySelector(".tag-name").dataset.tagId = tagId;
    tag.dataset.tagId = tagId;
    tag.querySelector(".tag-name").textContent = tagName;
    tag.style.backgroundColor = tagColor;
    //~apply event listener on delete tag button
    tag
      .querySelector(".btn-delete-tag")
      .addEventListener("click", tagModule.doRemoveTag);

    const selectedCard = document
      .querySelector(`[data-card-id="${cardId}"]`)
      .querySelector(".tag-box");
    selectedCard.append(tag);
  },
  //*DO DELETE TAGS
  async doRemoveTag(event) {
    const tagToRemove = event.target.closest(".tag[data-tag-id]");
    //todo remove
    console.log("tagToRemove: ", tagToRemove);
    const tagIdToRemove = tagToRemove.dataset.tagId;
    const cardId = event.target.closest("[data-card-id]").dataset.cardId;

    //todo remove
    console.log(tagToRemove);
    console.log("Id du tag sélectionné: ", tagIdToRemove);

    const options = {
      method: "DELETE"
    };

    const response = await fetch(
      `${url}${allCards}/${cardId}${allTags}/${tagIdToRemove}`,
      options
    );

    if (response.ok) {
      const deleteTag = await response.json();
      //todo remove
      console.log(deleteTag);
      //trick to see it immediately
      /* tagToRemove.remove(); */
      location.reload();
    }
  }
};

export { tagModule };