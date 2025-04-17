import { initialCards } from "./components/cards.js"; 
import './styles/index.css';
import { createCard, deleteCard, handleLikeButtonClick } from './components/card.js';
import { openPopup, closePopup } from './components/modal.js';

// Импорт иконок
import addIcon from "./images/add-icon.svg";
import closeIcon from "./images/close.svg";
import deleteIcon from "./images/delete-icon.svg";
import editIcon from "./images/edit-icon.svg";
import likeActiveIcon from "./images/like-active.svg";
import likeInactiveIcon from "./images/like-inactive.svg";

// Выбор элементов DOM
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileEditButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector('.profile__add-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popupAddCard = document.querySelector('.popup_type_new-card');
const addCardForm = popupAddCard.querySelector('.popup__form');
const titleInput = addCardForm.querySelector('.popup__input_type_card-name');
const linkInput = addCardForm.querySelector('.popup__input_type_url');
const cardsContainer = document.querySelector('.places__list');
const formElement = popupEdit.querySelector('.popup__form');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

// Установка иконок
document.querySelectorAll('.profile__add-button').forEach(button => {
  button.src = addIcon;
});
document.querySelectorAll('.popup__close').forEach(icon => {
  icon.src = closeIcon;
});
document.querySelectorAll('.card__delete-button').forEach(icon => {
  icon.src = deleteIcon;
});
document.querySelectorAll('.profile__edit-button').forEach(icon => {
  icon.src = editIcon;
});
document.querySelectorAll('.card__like-button_is-active').forEach(icon => {
  icon.src = likeActiveIcon;
});
document.querySelectorAll('.card__like-button:not(.card__like-button_is-active)').forEach(icon => {
  icon.src = likeInactiveIcon;
});

// Рендер карточек
function renderCards(cardsArray) {
  cardsArray.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard, handleLikeButtonClick, handleImageClick);
    cardsContainer.append(cardElement);
  });
}

// Обработчик отправки формы редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(popupEdit);
}

// Обработчик отправки формы добавления новой карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    name: titleInput.value,
    link: linkInput.value
  };

  const cardElement = createCard(newCard, deleteCard, handleLikeButtonClick, handleImageClick);
  cardsContainer.prepend(cardElement);

  closePopup(popupAddCard);
  addCardForm.reset();
}

// Обработчик клика по изображению карточки
function handleImageClick(cardData) {
  const popupImage = document.querySelector(".popup__image");
  const popupCaption = document.querySelector(".popup__caption");
  const popupImagePopup = document.querySelector(".popup_type_image");

  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;

  openPopup(popupImagePopup);
}

// Закрытие попапа по кнопке или клику вне попапа
document.querySelectorAll(".popup__close").forEach(button => {
  button.addEventListener("click", (evt) => {
    const popup = evt.target.closest(".popup");
    closePopup(popup);
  });
});

document.querySelectorAll(".popup").forEach(popup => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

// Открытие попапа редактирования профиля
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupEdit);
});

// Открытие попапа добавления новой карточки
addCardButton.addEventListener('click', () => {
  addCardForm.reset();
  openPopup(popupAddCard);
});

// Инициализация карточек
renderCards(initialCards);

// Добавление обработчика на форму редактирования
formElement.addEventListener('submit', handleFormSubmit);

// Добавление обработчика на форму добавления карточки
addCardForm.addEventListener('submit', handleAddCardSubmit);