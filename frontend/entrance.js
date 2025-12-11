const buttonEntrance = document.getElementById('buttonEntrance');
const inputLogin = document.getElementById('inputLogin');
const inputPassword = document.getElementById('inputPassword');
const rememberMe = document.getElementById('rememberMe');

// проверки если введен email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Функция проверки всей формы возвращает массив ошибок
function validateForm() {
    let errors = [];

    // Проверка логина/почты
    if (!inputLogin.value.trim()) {
        errors.push('Поле логин/почта обязательно для заполнения');
    }

    // Проверка пароля
    if (!inputPassword.value) {
        errors.push('Поле пароль обязательно для заполнения');
    } else if (inputPassword.value.length < 6) {
        errors.push('Пароль должен содержать минимум 6 символов');
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

// Сохранение данных при успешном входе (если выбрано "Запомнить меня")
function saveLoginData() {
    if (rememberMe.checked) {
        localStorage.setItem('savedLogin', inputLogin.value);
        localStorage.setItem('savedPassword', inputPassword.value);
    } else {
        localStorage.removeItem('savedLogin');
        localStorage.removeItem('savedPassword');
    }
}

// Обработчик клика по кнопке входа
buttonEntrance.addEventListener('click', function(event) {
    event.preventDefault(); 
    
    const errors = validateForm();
    
    if (errors.length === 0) {
        const loginData = {
            login: inputLogin.value,
            password: inputPassword.value,
            rememberMe: rememberMe.checked
        };
        
        console.log('Данные для входа:', loginData);
        
        saveLoginData();
        
        const isEmail = validateEmail(inputLogin.value);
        
        if (isEmail) {
            alert('Вход выполнен через email!');
        } else {
            alert('Вход выполнен через логин!');
        }
        
        // Перенаправление на главную страницу после успешного входа
        window.location.href = 'Main.html';
        
    } else {
        showErrorsInAlert(errors);
    }
});

// Валидация логина при вводе
inputLogin.addEventListener('blur', function() {
    if (inputLogin.value && inputLogin.value.length < 3 && !validateEmail(inputLogin.value)) {
        alert('Логин должен содержать минимум 3 символа или быть корректным email!');
    }
});

// Валидация пароля при вводе
inputPassword.addEventListener('blur', function() {
    if (inputPassword.value && inputPassword.value.length < 6) {
        alert('Пароль должен содержать минимум 6 символов!');
    }
});

// Обработчик для "Запомнить меня"
rememberMe.addEventListener('change', function() {
    if (this.checked) {
        console.log('Пользователь хочет быть запомненным');
    } else {
        console.log('Пользователь не хочет быть запомненным');
    }
});

// Дополнительно: отключение кнопки при невыполненных условиях
function updateButtonState() {
    const errors = validateForm();
    const isFormValid = errors.length === 0;
    buttonEntrance.disabled = !isFormValid;
    buttonEntrance.style.opacity = isFormValid ? '1' : '0.5';
}

// Добавляем обработчики для динамической проверки
[inputLogin, inputPassword].forEach(input => {
    input.addEventListener('input', updateButtonState);
});

// Автозаполнение при загрузке страницы 
document.addEventListener('DOMContentLoaded', function() {
    const savedLogin = localStorage.getItem('savedLogin');
    const savedPassword = localStorage.getItem('savedPassword');
    
    if (savedLogin && savedPassword) {
        inputLogin.value = savedLogin;
        inputPassword.value = savedPassword;
        rememberMe.checked = true;
    }
    
    updateButtonState();
});

// Показать/скрыть пароль (дополнительная функция)
function togglePasswordVisibility() {
    const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    inputPassword.setAttribute('type', type);
}

updateButtonState();