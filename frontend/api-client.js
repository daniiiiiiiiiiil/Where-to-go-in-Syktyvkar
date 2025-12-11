/**
 * Простой API клиент для начала
 */

class ApiClient {
    constructor() {
        this.baseUrl = 'http://localhost:8080/api';
        console.log('✅ API клиент инициализирован. Базовый URL:', this.baseUrl);
    }

    // Простой метод для тестирования
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/auth/test-connection`);
            const text = await response.text();
            console.log('✅ Тест соединения:', text);
            return text;
        } catch (error) {
            console.error('❌ Ошибка соединения:', error);
            alert('⚠️ Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен на localhost:8080');
            throw error;
        }
    }

    // Регистрация (упрощенная)
    async register(data) {
        console.log('📤 Отправка регистрации:', data);

        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Ошибка регистрации');
            }

            const result = await response.text();
            console.log('✅ Регистрация успешна:', result);
            return result;

        } catch (error) {
            console.error('❌ Ошибка регистрации:', error);
            throw error;
        }
    }

    // Вход (упрощенный)
    async login(username, password) {
        console.log('📤 Отправка входа:', { username, password });

        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Ошибка входа');
            }

            const token = await response.text();
            console.log('✅ Вход успешен. Токен получен');

            // Сохраняем токен
            localStorage.setItem('jwt_token', token);

            return token;

        } catch (error) {
            console.error('❌ Ошибка входа:', error);
            throw error;
        }
    }
}

// Создаем глобальный объект
window.api = new ApiClient();