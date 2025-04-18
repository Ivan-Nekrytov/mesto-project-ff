import { initialCards } from "./components/cards.js"; 
import './styles/index.css';
import { createCard, deleteCard, handleLikeButtonClick } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';

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
const profileFormElement = popupEdit.querySelector('.popup__form');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');
const popupImagePopup = document.querySelector(".popup_type_image");
const popupImage = popupImagePopup.querySelector(".popup__image");
const popupCaption = popupImagePopup.querySelector(".popup__caption");

// Рендер карточек
function renderCards(cardsArray) {
  cardsArray.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard, handleLikeButtonClick, handleImageClick);
    cardsContainer.append(cardElement);
  });
}

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(popupEdit);
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

  closeModal(popupAddCard);
  addCardForm.reset();
}

// Обработчик клика по изображению карточки
function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;

  openModal(popupImagePopup);
}

// Закрытие попапа по кнопке или клику вне попапа
document.querySelectorAll(".popup__close").forEach(button => {
  button.addEventListener("click", (evt) => {
    const popup = evt.target.closest(".popup");
    closeModal(popup);
  });
});

document.querySelectorAll(".popup").forEach(popup => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

// Открытие попапа редактирования профиля
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(popupEdit);
});

// Открытие попапа добавления новой карточки
addCardButton.addEventListener('click', () => {
  openModal(popupAddCard);
});

// Инициализация карточек
renderCards(initialCards);

// Добавление обработчика на форму редактирования
profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Добавление обработчика на форму добавления карточки
addCardForm.addEventListener('submit', handleAddCardSubmit);