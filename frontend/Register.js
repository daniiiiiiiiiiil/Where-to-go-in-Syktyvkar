// Получаем элементы
const buttonRegister = document.getElementById('buttonRegister');
const inputMail = document.getElementById('inputMail');
const inputLogin = document.getElementById('inputLogin');
const inputPassword = document.getElementById('inputPassword');
const inputPasswordConfirmation = document.getElementById('inputPasswordСonfirmation');
const checkBox = document.getElementById('CheckBox');

// Функция валидации email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Функция валидации пароля
function validatePassword(password) {   
    return password.length >= 6; 
}

// Функция проверки совпадения паролей
function checkPasswordMatch() {
    return inputPassword.value === inputPasswordConfirmation.value;
}

// Функция проверки всей формы (возвращает массив ошибок)
function validateForm() {
    let errors = [];

    // Проверка email
    if (!inputMail.value.trim()) {
        errors.push('Поле email обязательно для заполнения');
    } else if (!validateEmail(inputMail.value)) {
        errors.push('Введите корректный email');
    }

    // Проверка логина
    if (!inputLogin.value.trim()) {
        errors.push('Поле логин обязательно для заполнения');
    } else if (inputLogin.value.length < 3) {
        errors.push('Логин должен содержать минимум 3 символа');
    }

    // Проверка пароля
    if (!inputPassword.value) {
        errors.push('Поле пароль обязательно для заполнения');
    } else if (!validatePassword(inputPassword.value)) {
        errors.push('Пароль должен содержать минимум 6 символов');
    }

    // Проверка совпадения паролей
    if (!inputPasswordConfirmation.value) { 
        errors.push('Подтвердите пароль');
    } else if (!checkPasswordMatch()) {
        errors.push('Пароли не совпадают');
    }

    // Проверка согласия
    if (!checkBox.checked) {
        errors.push('Необходимо согласие на обработку данных');
    }

    return errors;
}

// Функция показа всех ошибок в alert
function showErrorsInAlert(errors) {
    if (errors.length > 0) {
        let errorMessage = "Обнаружены ошибки:\n\n";
        errors.forEach((error, index) => {
            errorMessage += `${index + 1}. ${error}\n`;
        });
        alert(errorMessage);
    }
}

// Обработчик клика по кнопке регистрации
buttonRegister.addEventListener('click', function(event) {
    event.preventDefault(); 
    
    const errors = validateForm();
    
    if (errors.length === 0) {
        const userData = {
            email: inputMail.value,
            login: inputLogin.value,
            password: inputPassword.value
        };
        
        console.log('Данные для регистрации:', userData);
        alert('Регистрация прошла успешно!');
        
        // Перенаправление на другую страницу только после успешной регистрации
        window.location.href = 'Main.html';
    } else {
        showErrorsInAlert(errors);
    }
});

// Реальная проверка паролей при вводе 
inputPasswordConfirmation.addEventListener('blur', function() { 
    if (inputPasswordConfirmation.value && !checkPasswordMatch()) { 
        alert('Пароли не совпадают!');
    }
});

// Валидация email при вводе 
inputMail.addEventListener('blur', function() {
    if (inputMail.value && !validateEmail(inputMail.value)) {
        alert('Введите корректный email!');
    }
});

// Валидация логина при вводе 
inputLogin.addEventListener('blur', function() {
    if (inputLogin.value && inputLogin.value.length < 3) {
        alert('Логин должен содержать минимум 3 символа!');
    }
});

// Дополнительно: отключение кнопки при невыполненных условиях
function updateButtonState() {
    const errors = validateForm();
    const isFormValid = errors.length === 0;
    buttonRegister.disabled = !isFormValid;
    buttonRegister.style.opacity = isFormValid ? '1' : '0.5';
}

// Добавляем обработчики для динамической проверки
[inputMail, inputLogin, inputPassword, inputPasswordConfirmation].forEach(input => {
    input.addEventListener('input', updateButtonState);
});

checkBox.addEventListener('change', updateButtonState);

updateButtonState();