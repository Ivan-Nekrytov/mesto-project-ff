const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-37',
  headers: {
    authorization: '01778306-6242-42d4-b33f-aa298394797c',
    'Content-Type': 'application/json'
  }
};

// Функция обработки ответа
function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// Получение карточек с сервера
function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(handleResponse);
}

// Получение информации о пользователе
function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(handleResponse);
}

function updateUserInfo({ name, about }) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  })
  .then(handleResponse);
}

function addNewCard(cardData) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: cardData.name,
      link: cardData.link
    })
  })
  .then(handleResponse);
}

function deleteCardFromServer(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(handleResponse);
}

function likeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  })
  .then(handleResponse);
}

function unlikeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(handleResponse);
}

function updateAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl })
  })
    .then(handleResponse);
}

export { getInitialCards, getUserInfo, updateUserInfo, addNewCard, deleteCardFromServer, likeCard, unlikeCard, updateAvatar };
