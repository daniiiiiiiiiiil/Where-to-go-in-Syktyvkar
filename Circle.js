document.addEventListener('DOMContentLoaded', function() {
    // Данные для 10 компаний с реальными тратами
    const companies = [
        { name: "Транспорт", amount: 25000, color: "#FF6B6B" },
        { name: "Кино", amount: 18000, color: "#4ECDC4" },
        { name: "Магнит", amount: 22000, color: "#45B7D1" },
        { name: "Пятерочка", amount: 19000, color: "#FFA07A" },
        { name: "Вкусно и точка", amount: 15000, color: "#98D8C8" },
        { name: "Переводы", amount: 12000, color: "#F7DC6F" },
        { name: "Подписки", amount: 8000, color: "#BB8FCE" },
        { name: "Театр", amount: 11000, color: "#85C1E9" },
        { name: "Образование", amount: 30000, color: "#82E0AA" },
        { name: "Спорт", amount: 16000, color: "#F8C471" }
    ];

    // Рассчитываем общую сумму
    const totalAmount = companies.reduce((sum, company) => sum + company.amount, 0);
    
    // Обновляем общую сумму в интерфейсе
    const amountElement = document.querySelector('.amount');
    const currencyElement = document.querySelector('.currency');
    if (amountElement && currencyElement) {
        amountElement.textContent = totalAmount.toLocaleString('ru-RU');
        currencyElement.textContent = '₽';
    }

    // Создаем сегменты круга
    createCircleSegments(companies, totalAmount);
    
    // Создаем легенду с названиями трат
    createExpensesLegend(companies);
});

function createCircleSegments(companies, totalAmount) {
    const svg = document.querySelector('.circle-chart-svg');
    if (!svg) return;
    
    const circumference = 2 * Math.PI * 15.9155;
    let accumulatedPercentage = 0;

    // Очищаем существующие сегменты (кроме фона)
    const existingSegments = document.querySelectorAll('.circle-segment');
    existingSegments.forEach(segment => segment.remove());

    companies.forEach((company, index) => {
        const percentage = (company.amount / totalAmount) * 100;
        const dashLength = (percentage / 100) * circumference;
        const offset = (accumulatedPercentage / 100) * circumference;

        // Создаем основной сегмент
        const segment = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        segment.classList.add('circle-segment');
        segment.setAttribute('data-percentage', percentage.toFixed(1));
        segment.setAttribute('stroke', company.color);
        segment.setAttribute('stroke-dasharray', `0 ${circumference}`);
        segment.setAttribute('d', `M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`);
        
        svg.appendChild(segment);

        // Анимируем основной сегмент
        setTimeout(() => {
            segment.style.strokeDasharray = `${dashLength} ${circumference}`;
            segment.style.strokeDashoffset = -offset;
            segment.style.transition = 'all 1.5s ease-in-out';
        }, index * 200);

        accumulatedPercentage += percentage;
    });
}

// Функция для создания легенды с названиями трат
function createExpensesLegend(companies) {
    const legendContainer = document.createElement('div');
    legendContainer.className = 'expenses-legend';
    
    companies.forEach(company => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const percentage = ((company.amount / companies.reduce((sum, c) => sum + c.amount, 0)) * 100).toFixed(1);
        
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${company.color}"></div>
            <div class="legend-name">${company.name}</div>
            <div class="legend-amount">${company.amount.toLocaleString('ru-RU')} ₽</div>
            <div class="legend-percentage">${percentage}%</div>
        `;
        
        legendContainer.appendChild(legendItem);
    });
    
    // Добавляем легенду на страницу
    document.body.appendChild(legendContainer);
}

// Функция для обновления данных
function updateChartData(newCompanies) {
    // Удаляем старые сегменты
    const oldSegments = document.querySelectorAll('.circle-segment');
    oldSegments.forEach(segment => segment.remove());
    
    // Удаляем старую легенду
    const oldLegend = document.querySelector('.expenses-legend');
    if (oldLegend) oldLegend.remove();
    
    // Создаем новые данные
    const totalAmount = newCompanies.reduce((sum, company) => sum + company.amount, 0);
    const amountElement = document.querySelector('.amount');
    const currencyElement = document.querySelector('.currency');
    if (amountElement && currencyElement) {
        amountElement.textContent = totalAmount.toLocaleString('ru-RU');
        currencyElement.textContent = '₽';
    }
    
    createCircleSegments(newCompanies, totalAmount);
    createExpensesLegend(newCompanies);
}