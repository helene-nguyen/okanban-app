//~import modules
import { url, allCards, allTags } from "./index.js";

const tagModule = {
  //*HANDLE TAG FORM
  async handleAddTagsForm(cardId, event) {
    const tagElement = event.target.closest(".tag-box");
    let currentTags = tagElement.querySelectorAll(".tag-name");

    //if tag name exist, find tagid for update
    //get data from form
    const data = new FormData(event.target);
    let tagName = data.get("new_tag");
    let tagColor = data.get("color_tag");

    //if a tag exist
    if (currentTags) {
      //create an array of objects with name of tags
      let tags = [];

      for (let currentTag of currentTags) {
        currentTag = {
          tagName: currentTag.textContent,
          id: currentTag.dataset.tagId
        };

        tags.push(currentTag);
      }

      for (const tag of tags) {
        if (tag.tagName === tagName) {
          let tagId = tag.id;
          //if the tag exist and have the same name, we can update the color
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
            await response.json();
            location.reload();
          } else {
            throw new Error("Cannot edit this tag, server error");
          }
        }
      }
    }
    //if a tag doesn't exist, we create a new one or take an existing one
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
      await response.json();
      /* Reloading the page */
      location.reload();
    } else {
      throw new Error("Cannot create or modify this tag, server error");
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
    const tagIdToRemove = tagToRemove.dataset.tagId;
    const cardId = event.target.closest("[data-card-id]").dataset.cardId;

    const options = {
      method: "DELETE"
    };

    const response = await fetch(
      `${url}${allCards}/${cardId}${allTags}/${tagIdToRemove}`,
      options
    );

    if (response.ok) {
      await response.json();
      //trick to see it immediately
      /* tagToRemove.remove(); */
      location.reload();
    } else {
      throw new Error("Cannot remove this tag, server error");
    }
  }
};

export { tagModule };
