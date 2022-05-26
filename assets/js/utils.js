const animationLetters = {
  defineAnimation() {
    const textWrapper = document.querySelector(".ml9 .letters");

    textWrapper.innerHTML = textWrapper.textContent.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );

    anime
      .timeline({
        loop: true
      })
      .add({
        targets: ".ml9 .letter",
        scale: [0, 1],
        duration: 1500,
        elasticity: 600,
        delay: (el, i) => 45 * (i + 1)
      })
      .add({
        targets: ".ml9",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }
};

const converter = {
  /**
     * Convert RGB to Hexadecimal
     * @param {*} color in RGB => ex: rgb(255, 159, 128)
     * @returns 
     */
  getHexFromRGB(color) {
    let a = color.split(",");
    let b = a.map(function(element) {
      //For each array element
      element = parseInt(element).toString(16); //Convert to a base16 string
      return element.length == 1 ? "0" + element : element; //Add zero if we get only one character
    });
    return (b = "#" + b.join(""));
  }
};

function displayNotification(message) {
  const popUpElement = document.querySelector(".notification");
  console.log("popUpElement: ", popUpElement);
  popUpElement.classList.remove("is-hidden");
  popUpElement.querySelector(".message-popup").textContent = message;

  popUpElement
    .querySelector(".delete")
    .addEventListener("click", handleRemoveNotification);
}

function handleRemoveNotification() {
  const popUpElement = document.querySelector(".notification");
  popUpElement.classList.add("is-hidden");
  location.reload();
}

export { animationLetters, converter, displayNotification };
