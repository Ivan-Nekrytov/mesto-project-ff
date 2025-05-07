const showInputError = (formElement, inputElement, errorMessage, validationConfig) => {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
	inputElement.classList.add(validationConfig.inputErrorClass)
	errorElement.textContent = errorMessage
	errorElement.classList.add(validationConfig.errorClass)
}

const hideInputError = (formElement, inputElement, validationConfig) => {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
	inputElement.classList.remove(validationConfig.inputErrorClass)
	inputElement.setCustomValidity('')
	errorElement.classList.remove(validationConfig.errorClass)
	errorElement.textContent = ''
}

const checkInputValidity = (formElement, inputElement, validationConfig) => {
  // Кастомная ошибка для patternMismatch
  if (inputElement.validity.patternMismatch && inputElement.dataset.errorMessage) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } 
  else if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity('Вы пропустили это поле.');
  } 
  // Кастомная ошибка для поля "ссылка на картинку"
  else if (inputElement.name === 'place-link' && inputElement.validity.typeMismatch) {
    inputElement.setCustomValidity('Введите адрес сайта.');
  }
  else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};


const setEventListeners = (formElement, validationConfig) => {
	const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector))
	const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector)
	toggleButtonState(inputList, buttonElement, validationConfig)
	inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
			checkInputValidity(formElement, inputElement, validationConfig)
			toggleButtonState(inputList, buttonElement, validationConfig)
		})
	})
}

const enableValidation = validationConfig => {
	const formList = Array.from(document.querySelectorAll(validationConfig.formSelector))
	formList.forEach(formElement => {
		setEventListeners(formElement, validationConfig)
	})
}

const hasInvalidInput = (inputList, validationConfig) => {
	return inputList.some(inputElement => {
		return !inputElement.validity.valid
	})
}

const toggleButtonState = (inputList, buttonElement, validationConfig) => {
	if (hasInvalidInput(inputList)) {
		buttonElement.disabled = true
		buttonElement.classList.add(validationConfig.inactiveButtonClass)
	} else {
		buttonElement.disabled = false
		buttonElement.classList.remove(validationConfig.inactiveButtonClass)
	}
}

const clearValidation = (formElement, validationConfig) => {
	const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector))
	const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector)
	inputList.forEach(inputElement => {
		hideInputError(formElement, inputElement, validationConfig)
	})
	toggleButtonState(inputList, buttonElement, validationConfig)
}

export { clearValidation, enableValidation }