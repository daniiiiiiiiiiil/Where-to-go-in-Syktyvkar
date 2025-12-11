// Получаем элементы
const buttonEntrance = document.getElementById('buttonEntrance');
const inputLogin = document.getElementById('inputLogin');
const inputPassword = document.getElementById('inputPassword');
const rememberMe = document.getElementById('rememberMe');

// Функция проверки всей формы возвращает массив ошибок
function validateForm() {
    let errors = [];

    // Проверка логина
    if (!inputLogin.value.trim()) {
        errors.push('Поле логин обязательно для заполнения');
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
        localStorage.setItem('savedUsername', inputLogin.value);
    } else {
        localStorage.removeItem('savedUsername');
    }
}

// Обработчик клика по кнопке входа
buttonEntrance.addEventListener('click', async function(event) {
    event.preventDefault();

    const errors = validateForm();

    if (errors.length === 0) {
        try {
            // Показываем индикатор загрузки
            buttonEntrance.disabled = true;
            buttonEntrance.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';

            const credentials = {
                username: inputLogin.value,
                password: inputPassword.value
            };

            console.log('📤 Отправка данных для входа:', credentials);

            // Отправляем запрос на бэкенд
            const token = await api.login(credentials.username, credentials.password);

            console.log('✅ Получен токен:', token.substring(0, 20) + '...');

            saveLoginData();

            alert('✅ Вход выполнен успешно!');

            // Перенаправление на главную страницу после успешного входа
            window.location.href = 'Main.html';

        } catch (error) {
            console.error('❌ Ошибка входа:', error);

            // Показываем ошибку от бэкенда
            const errorMessage = error.message || 'Неверный логин или пароль';
            alert('❌ Ошибка: ' + errorMessage);

        } finally {
            // Возвращаем кнопку в исходное состояние
            buttonEntrance.disabled = false;
            buttonEntrance.innerHTML = 'Войти в аккаунт';
        }

    } else {
        showErrorsInAlert(errors);
    }
});

// Валидация пароля при вводе
inputPassword.addEventListener('blur', function() {
    if (inputPassword.value && inputPassword.value.length < 6) {
        alert('❌ Пароль должен содержать минимум 6 символов!');
    }
});

// Обработчик для "Запомнить меня"
rememberMe.addEventListener('change', function() {
    if (this.checked) {
        console.log('💾 Пользователь хочет быть запомненным');
    } else {
        console.log('💾 Пользователь не хочет быть запомненным');
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
    const savedUsername = localStorage.getItem('savedUsername');

    if (savedUsername) {
        inputLogin.value = savedUsername;
        rememberMe.checked = true;
    }

    updateButtonState();

    // Проверяем, если уже есть токен - перенаправляем на главную
    const token = localStorage.getItem('jwt_token');
    if (token) {
        console.log('🔑 Найден сохраненный токен, перенаправление...');
        // Можно раскомментировать для автоматического входа
        // window.location.href = 'Main.html';
    }
});