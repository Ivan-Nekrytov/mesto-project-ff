import { likeCard, unlikeCard, deleteCardFromServer } from './api.js';

function createCard(cardData, userId, likeCallback, imageClickCallback, deleteCallback) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector('.card__like-count');

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  if (cardData.likes.some(like => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (cardData.owner._id === userId) {
    deleteButton.addEventListener("click", () => {
      deleteCallback(cardElement, cardData._id);
    });
  } else {
    deleteButton.style.display = "none";
  }

  likeButton.addEventListener("click", () => {
    likeCallback(likeButton, likeCounter, cardData._id);
  });

  cardImage.addEventListener("click", () => imageClickCallback(cardData));

  return cardElement;
}

function deleteCard(cardElement) {
  cardElement.remove();
}

function handleLikeButtonClick(likeButton, likeCounter, cardId) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (!isLiked) {
    likeCard(cardId)
      .then((updatedCard) => {
        likeButton.classList.add('card__like-button_is-active');
        likeCounter.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log('Ошибка при постановке лайка:', err);
      });
  } else {
    unlikeCard(cardId) 
      .then((updatedCard) => {
        likeButton.classList.remove('card__like-button_is-active');
        likeCounter.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log('Ошибка при снятии лайка:', err);
      });
  }
}

function handleDeleteButtonClick(cardElement, cardId) {
  deleteCardFromServer(cardId)
    .then(() => cardElement.remove())
    .catch((err) => {
      console.log('Ошибка при удалении карточки:', err);
    });
}

export { createCard, deleteCard, handleLikeButtonClick, handleDeleteButtonClick };
