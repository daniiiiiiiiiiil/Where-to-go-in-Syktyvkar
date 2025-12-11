// База данных транзакций (в реальном приложении была бы загрузка с сервера)
let transactions = JSON.parse(localStorage.getItem('finTrackTransactions')) || [
    {
        id: 1,
        name: "Магнит - Продукты",
        amount: 4250,
        category: "Продукты",
        date: new Date(2025, 6, 19, 14, 30), // 19 июля 2025, 14:30
        company: "Магнит"
    },
    {
        id: 2,
        name: "Яндекс.Такси",
        amount: 850,
        category: "Транспорт",
        date: new Date(2025, 6, 19, 10, 15), // 19 июля 2025, 10:15
        company: "Яндекс"
    },
    {
        id: 3,
        name: "Ресторан 'Гранатный'",
        amount: 3200,
        category: "Рестораны",
        date: new Date(2025, 6, 18, 19, 45), // 18 июля 2025, 19:45
        company: "Гранатный"
    },
    {
        id: 4,
        name: "АЗС Лукойл",
        amount: 2800,
        category: "Топливо",
        date: new Date(2025, 6, 17, 12, 0), // 17 июля 2025, 12:00
        company: "Лукойл"
    },
    {
        id: 5,
        name: "Кинотеатр 'Октябрь'",
        amount: 1200,
        category: "Развлечения",
        date: new Date(2025, 6, 16, 20, 0), // 16 июля 2025, 20:00
        company: "Октябрь"
    },
    {
        id: 6,
        name: "Аптека 'Неофарм'",
        amount: 650,
        category: "Другое",
        date: new Date(2025, 6, 15, 11, 30), // 15 июля 2025, 11:30
        company: "Неофарм"
    },
    {
        id: 7,
        name: "Перекресток",
        amount: 3150,
        category: "Продукты",
        date: new Date(2025, 6, 14, 16, 45), // 14 июля 2025, 16:45
        company: "Перекресток"
    },
    {
        id: 8,
        name: "Метро",
        amount: 120,
        category: "Транспорт",
        date: new Date(2025, 6, 13, 8, 30), // 13 июля 2025, 8:30
        company: "Метрополитен"
    }
];

// Текущий выбранный период
let currentPeriod = 'month';

// Функция для форматирования даты
function formatDate(date) {
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return `Сегодня, ${date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    } else if (diffDays === 1) {
        return `Вчера, ${date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    } else if (diffDays < 7) {
        return `${diffDays} дня назад`;
    } else {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long'
        });
    }
}

// Функция для получения начала периода
function getPeriodStart(period) {
    const now = new Date();
    const start = new Date(now);
    
    switch(period) {
        case 'day':
            start.setHours(0, 0, 0, 0);
            break;
        case 'week':
            start.setDate(now.getDate() - now.getDay() + 1); // Понедельник этой недели
            start.setHours(0, 0, 0, 0);
            break;
        case 'month':
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            break;
        case 'year':
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            break;
    }
    
    return start;
}

// Функция для фильтрации транзакций по периоду
function filterTransactionsByPeriod(period) {
    const periodStart = getPeriodStart(period);
    const now = new Date();
    
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= periodStart && transactionDate <= now;
    });
}

// Функция для расчета статистики
function calculateStatistics(filteredTransactions) {
    const stats = {
        total: 0,
        byCategory: {},
        companies: new Set(),
        count: filteredTransactions.length
    };
    
    filteredTransactions.forEach(transaction => {
        stats.total += transaction.amount;
        stats.companies.add(transaction.company);
        
        if (!stats.byCategory[transaction.category]) {
            stats.byCategory[transaction.category] = {
                total: 0,
                count: 0
            };
        }
        
        stats.byCategory[transaction.category].total += transaction.amount;
        stats.byCategory[transaction.category].count++;
    });
    
    return stats;
}

// Функция для обновления отображения
function updateDisplay() {
    const filteredTransactions = filterTransactionsByPeriod(currentPeriod);
    const stats = calculateStatistics(filteredTransactions);
    
    // Обновление заголовка периода
    const periodTitles = {
        'day': 'Общие расходы за сегодня',
        'week': 'Общие расходы за неделю',
        'month': 'Общие расходы за месяц',
        'year': 'Общие расходы за год'
    };
    
    document.getElementById('periodTitle').textContent = periodTitles[currentPeriod];
    
    // Обновление общей суммы
    document.getElementById('totalAmount').textContent = stats.total.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('circleAmount').textContent = stats.total.toLocaleString('ru-RU') + ' ₽';
    
    // Обновление информации о транзакциях
    const companiesCount = stats.companies.size;
    document.getElementById('transactionsInfo').textContent = 
        `${companiesCount} компаний • ${stats.count} транзакций`;
    document.getElementById('circleCompanies').textContent = 
        `${companiesCount} компаний`;
    
    // Обновление легенды
    updateLegend(stats.byCategory, stats.total);
    
    // Обновление списка транзакций
    updateTransactionsList(filteredTransactions);
    
    // Обновление круговой диаграммы
    updateCircleChart(stats.byCategory);
}

// Функция для обновления легенды
function updateLegend(categoryStats, totalAmount) {
    const legendItems = document.getElementById('legendItems');
    legendItems.innerHTML = '';
    
    // Цвета для категорий
    const categoryColors = {
        'Продукты': '#4f46e5',
        'Транспорт': '#3b82f6',
        'Рестораны': '#8b5cf6',
        'Топливо': '#ef4444',
        'Развлечения': '#f59e0b',
        'Другое': '#10b981'
    };
    
    // Сортировка по убыванию суммы
    const sortedCategories = Object.entries(categoryStats)
        .sort((a, b) => b[1].total - a[1].total);
    
    sortedCategories.forEach(([category, data]) => {
        const percentage = totalAmount > 0 ? Math.round((data.total / totalAmount) * 100) : 0;
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${categoryColors[category] || '#6b7280'}"></div>
            <div class="legend-name">
                ${category}
                <span class="legend-count">(${data.count})</span>
            </div>
            <div class="legend-amount">${data.total.toLocaleString('ru-RU')} ₽</div>
            <div class="legend-percentage">${percentage}%</div>
        `;
        
        legendItems.appendChild(legendItem);
    });
}

// Функция для обновления списка транзакций
function updateTransactionsList(transactionsList) {
    const transactionsListElement = document.getElementById('blockUl');
    transactionsListElement.innerHTML = '';
    
    // Сортировка по дате (сначала новые)
    const sortedTransactions = [...transactionsList].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    sortedTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="Block">
                <div class="info">${transaction.name}</div>
                <div class="price">${transaction.amount.toLocaleString('ru-RU')} ₽</div>
                <div class="Data">${formatDate(new Date(transaction.date))}</div>
            </div>
        `;
        
        transactionsListElement.appendChild(li);
    });
}

// Функция для обновления круговой диаграммы
function updateCircleChart(categoryStats) {
    const svg = document.querySelector('.circle-chart-svg');
    
    // Удаляем старые сегменты
    const oldSegments = svg.querySelectorAll('.circle-segment');
    oldSegments.forEach(segment => segment.remove());
    
    // Цвета для категорий
    const categoryColors = {
        'Продукты': '#4f46e5',
        'Транспорт': '#3b82f6',
        'Рестораны': '#8b5cf6',
        'Топливо': '#ef4444',
        'Развлечения': '#f59e0b',
        'Другое': '#10b981'
    };
    
    // Рассчитываем общую сумму для процентного соотношения
    const total = Object.values(categoryStats).reduce((sum, data) => sum + data.total, 0);
    
    let cumulativePercent = 0;
    let index = 0;
    
    // Создаем новые сегменты
    Object.entries(categoryStats).forEach(([category, data]) => {
        if (total > 0) {
            const percent = (data.total / total) * 100;
            
            const segment = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            segment.classList.add('circle-segment');
            segment.setAttribute('d', describeArc(18, 18, 15.9155, cumulativePercent, cumulativePercent + percent));
            segment.setAttribute('stroke', categoryColors[category] || '#6b7280');
            segment.setAttribute('data-category', category);
            
            // Анимация
            segment.style.strokeDasharray = `${percent} ${100 - percent}`;
            segment.style.strokeDashoffset = 0;
            
            svg.appendChild(segment);
            
            cumulativePercent += percent;
            index++;
        }
    });
}

// Вспомогательная функция для создания дуг
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
}

// Функция показа уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const bgColor = type === 'success' 
        ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' 
        : 'linear-gradient(135deg, #ef4444, #dc2626)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация элементов DOM
    const addButton = document.getElementById('addExpenseButton');
    const panel = document.getElementById('addExpensePanel');
    const overlay = document.getElementById('panelOverlay');
    const closeButton = document.getElementById('closePanel');
    const expenseForm = document.getElementById('expenseForm');
    const periodButtons = document.querySelectorAll('.period-button');
    const dateInput = document.getElementById('expenseDate');
    
    // Установка сегодняшней даты по умолчанию
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.max = today;
    
    // Инициализация отображения
    updateDisplay();
    
    // Обработчики для кнопок периода
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            periodButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Обновляем текущий период
            currentPeriod = this.dataset.period;
            
            // Обновляем отображение
            updateDisplay();
        });
    });
    
    // Открытие панели добавления траты
    addButton.addEventListener('click', () => {
        panel.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Закрытие панели
    function closePanel() {
        panel.style.display = 'none';
        document.body.style.overflow = 'auto';
        expenseForm.reset();
        dateInput.value = today;
    }
    
    overlay.addEventListener('click', closePanel);
    closeButton.addEventListener('click', closePanel);
    
    // Обработка отправки формы
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('expenseName').value.trim();
        const amount = parseInt(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;
        const date = new Date(document.getElementById('expenseDate').value);
        
        if (!name || !amount || amount <= 0) {
            showNotification('Пожалуйста, заполните все поля корректно', 'error');
            return;
        }
        
        // Создание новой транзакции
        const newTransaction = {
            id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
            name: name,
            amount: amount,
            category: category,
            date: date,
            company: name.split('-')[0]?.trim() || name.split(' ')[0] || 'Неизвестно'
        };
        
        // Добавление в массив транзакций
        transactions.push(newTransaction);
        
        // Сохранение в localStorage
        localStorage.setItem('finTrackTransactions', JSON.stringify(transactions));
        
        // Обновление отображения
        updateDisplay();
        
        // Закрытие панели и сброс формы
        closePanel();
        
        // Показать уведомление
        showNotification('Трата успешно добавлена!');
    });
    
    // Добавляем стили для анимации уведомления
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .legend-count {
            font-size: 12px;
            color: #6b7280;
            font-weight: normal;
            margin-left: 5px;
        }
    `;
    document.head.appendChild(style);
});

// Функция для добавления тестовых данных (для демонстрации)
function addTestData() {
    const testTransactions = [
        {
            id: 9,
            name: "Спортзал 'Фитнес-Лэнд'",
            amount: 2500,
            category: "Другое",
            date: new Date(2025, 6, 12, 18, 0),
            company: "Фитнес-Лэнд"
        },
        {
            id: 10,
            name: "Кофейня 'Starbucks'",
            amount: 450,
            category: "Рестораны",
            date: new Date(2025, 6, 11, 9, 30),
            company: "Starbucks"
        },
        {
            id: 11,
            name: "Автобус",
            amount: 60,
            category: "Транспорт",
            date: new Date(2025, 6, 10, 7, 45),
            company: "ГорТранс"
        }
    ];
    
    transactions.push(...testTransactions);
    localStorage.setItem('finTrackTransactions', JSON.stringify(transactions));
    updateDisplay();
}