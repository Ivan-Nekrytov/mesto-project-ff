function createCard(cardData, deleteCallback) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => deleteCallback(cardElement));

  return cardElement;
}

function renderCards(cardsArray) {
  const cardsContainer = document.querySelector(".places__list");

  cardsArray.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard);
    cardsContainer.append(cardElement);
  });
}

function deleteCard(cardElement) {
  cardElement.remove();
}

renderCards(initialCards);
