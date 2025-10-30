// Получаем элементы
const buttonEntrance = document.getElementById('buttonEntrance');
const inputLogin = document.getElementById('inputLogin');
const inputPassword = document.getElementById('inputPassword');
const rememberMe = document.getElementById('rememberMe');

// Функция валидации email (для проверки если введен email)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Функция проверки всей формы (возвращает массив ошибок)
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
        
        // Проверяем, является ли ввод email или логином
        const isEmail = validateEmail(inputLogin.value);
        
        if (isEmail) {
            alert('Вход выполнен через email!');
        } else {
            alert('Вход выполнен через логин!');
        }
        
        // Здесь обычно отправка данных на сервер
        // window.location.href = 'dashboard.html'; // Перенаправление после успешного входа
        
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
        // Здесь можно сохранить в localStorage
    } else {
        console.log('Пользователь не хочет быть запомненным');
        // Здесь можно удалить из localStorage
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

// Инициализация состояния кнопки при загрузке
updateButtonState();

// Дополнительные функции для улучшения UX

// Показать/скрыть пароль (можно добавить иконку глаза)
function togglePasswordVisibility() {
    const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    inputPassword.setAttribute('type', type);
}

// Автозаполнение при загрузке страницы (если пользователь выбрал "Запомнить меня")
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем сохраненные данные в localStorage
    const savedLogin = localStorage.getItem('savedLogin');
    const savedPassword = localStorage.getItem('savedPassword');
    
    if (savedLogin && savedPassword) {
        inputLogin.value = savedLogin;
        inputPassword.value = savedPassword;
        rememberMe.checked = true;
    }
    
    updateButtonState();
});

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

// Обновляем обработчик кнопки входа для сохранения данных
const originalClickHandler = buttonEntrance.onclick;
buttonEntrance.onclick = function(event) {
    if (validateForm().length === 0) {
        saveLoginData();
    }
    if (originalClickHandler) {
        originalClickHandler.call(this, event);
    }
};