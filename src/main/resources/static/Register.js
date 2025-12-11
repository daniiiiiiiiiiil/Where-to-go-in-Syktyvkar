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
buttonRegister.addEventListener('click', async function(event) {
    event.preventDefault();

    const errors = validateForm();

    if (errors.length === 0) {
        try {
            // Показываем индикатор загрузки
            buttonRegister.disabled = true;
            buttonRegister.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';

            // Подготавливаем данные для бэкенда
            const userData = {
                username: inputLogin.value,
                email: inputMail.value,
                password: inputPassword.value,
                confirmPassword: inputPasswordConfirmation.value
            };

            console.log('📤 Отправка данных:', userData);

            // Отправляем запрос на бэкенд
            const result = await api.register(userData);

            console.log('✅ Ответ бэкенда:', result);

            alert('✅ Регистрация прошла успешно! Теперь войдите в систему.');

            // Перенаправление на страницу входа
            window.location.href = 'entrance.html';

        } catch (error) {
            console.error('❌ Ошибка регистрации:', error);

            // Показываем ошибку от бэкенда
            const errorMessage = error.message || 'Ошибка при регистрации. Проверьте введенные данные.';
            alert('❌ Ошибка: ' + errorMessage);

        } finally {
            // Возвращаем кнопку в исходное состояние
            buttonRegister.disabled = false;
            buttonRegister.innerHTML = 'Создать аккаунт';
        }
    } else {
        showErrorsInAlert(errors);
    }
});

// Реальная проверка паролей при вводе
inputPasswordConfirmation.addEventListener('blur', function() {
    if (inputPasswordConfirmation.value && !checkPasswordMatch()) {
        alert('❌ Пароли не совпадают!');
    }
});

// Валидация email при вводе
inputMail.addEventListener('blur', function() {
    if (inputMail.value && !validateEmail(inputMail.value)) {
        alert('❌ Введите корректный email!');
    }
});

// Валидация логина при вводе
inputLogin.addEventListener('blur', function() {
    if (inputLogin.value && inputLogin.value.length < 3) {
        alert('❌ Логин должен содержать минимум 3 символа!');
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

// При загрузке проверяем соединение с бэкендом
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Проверка соединения с бэкендом...');

    // Можно раскомментировать для автоматической проверки
    // testBackendConnection().catch(() => {
    //     alert('⚠️ Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен на localhost:8080');
    // });

    updateButtonState();
});