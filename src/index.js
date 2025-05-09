import './styles/index.css';
import { createCard, handleLikeButtonClick } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { getInitialCards, getUserInfo, updateUserInfo, addNewCard, deleteCardFromServer, updateAvatar  } from './components/api.js';
import { enableValidation, clearValidation } from './components/validate.js';

let userId;

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
const avatarEditButton = document.querySelector('.profile__image');
const popupAvatar = document.querySelector('.popup_type_avatar');
const avatarForm = popupAvatar.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar-url');
const profileSaveButton = profileFormElement.querySelector('.popup__button');
const addCardSaveButton = addCardForm.querySelector('.popup__button');
const avatarSaveButton = avatarForm.querySelector('.popup__button');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

function renderCards(cardsArray) {
  cardsArray.forEach(cardData => {
    const cardElement = createCard(
      cardData,
      userId,
      handleLikeButtonClick,
      handleImageClick
    );
    cardsContainer.append(cardElement);
  });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, profileSaveButton);

  const newName = nameInput.value;
  const newAbout = jobInput.value;

  updateUserInfo({ name: newName, about: newAbout })
    .then(userData => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(popupEdit);
    })
    .catch(err => {
      console.log('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
      renderLoading(false, profileSaveButton);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, addCardSaveButton);
  const newCardData = {
    name: titleInput.value,
    link: linkInput.value
  };

  addNewCard(newCardData)
    .then((createdCard) => {
      const cardElement = createCard(createdCard, userId, handleLikeButtonClick, handleImageClick);
      cardsContainer.prepend(cardElement);
      closeModal(popupAddCard);
      addCardForm.reset();
    })
    .catch((err) => {
      console.log('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      renderLoading(false, addCardSaveButton);
    });
}

function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;

  openModal(popupImagePopup);
}

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

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(popupEdit);
  clearValidation(profileFormElement, validationConfig);
});

addCardButton.addEventListener('click', () => {
  openModal(popupAddCard);
  clearValidation(addCardForm, validationConfig);
});

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;

    const profileImage = avatarEditButton;
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;

    renderCards(cards);
  })
  .catch(err => {
    console.log('Ошибка при получении данных с сервера:', err);
  });

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

addCardForm.addEventListener('submit', handleAddCardSubmit);

avatarEditButton.addEventListener('click', () => {
  openModal(popupAvatar);
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, avatarSaveButton);
  updateAvatar(avatarInput.value)
    .then((userData) => {
      const profileImage = avatarEditButton;
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(popupAvatar);
      avatarForm.reset();
    })
    .catch((err) => {
      console.log('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      renderLoading(false, avatarSaveButton);
    });
}

avatarForm.addEventListener('submit', handleAvatarSubmit);

function renderLoading(isLoading, buttonElement, defaultText = "Сохранить") {
  buttonElement.textContent = isLoading ? "Сохранение..." : defaultText;
}

enableValidation(validationConfig);