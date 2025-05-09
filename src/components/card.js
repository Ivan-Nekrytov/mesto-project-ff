import { likeCard, unlikeCard, deleteCardFromServer } from './api.js';

function createCard(cardData, userId, likeCallback, imageClickCallback) {
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

  // Отмечаем активный лайк, если пользователь уже лайкнул
  if (cardData.likes.some(like => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Показываем кнопку удаления только владельцу
  if (cardData.owner._id === userId) {
    deleteButton.addEventListener("click", () => {
      deleteCardFromServer(cardData._id)
        .then(() => cardElement.remove())
        .catch((err) => {
          console.log('Ошибка при удалении карточки:', err);
        });
    });
  } else {
    deleteButton.style.display = "none";
  }

  // Лайк
  likeButton.addEventListener("click", () => {
    likeCallback(likeButton, likeCounter, cardData._id);
  });

  // Открытие изображения
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

export { createCard, deleteCard, handleLikeButtonClick };
