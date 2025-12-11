document.addEventListener('DOMContentLoaded', function() {
    // Данные из вашего изображения
    const companies = [
        { name: "Пятерочка", amount: 19000, color: "#FF6B6B" },
        { name: "Вкусно и точка", amount: 15000, color: "#4ECDC4" },
        { name: "Переводы", amount: 12000, color: "#45B7D1" },
        { name: "Подписки", amount: 8000, color: "#FFA07A" },
        { name: "Театр", amount: 11000, color: "#98D8C8" },
        { name: "Образование", amount: 30000, color: "#F7DC6F" },
        { name: "Спорт", amount: 16000, color: "#BB8FCE" }
    ];

    // Рассчитываем общую сумму
    const totalAmount = companies.reduce((sum, company) => sum + company.amount, 0);
    
    // Обновляем общую сумму в интерфейсе
    const amountElement = document.querySelector('.amount');
    if (amountElement) {
        amountElement.textContent = totalAmount.toLocaleString('ru-RU') + ' ₽';
    }

    // Обновляем общую сумму в шапке
    const totalAmountElement = document.querySelector('.total-amount');
    if (totalAmountElement) {
        totalAmountElement.textContent = totalAmount.toLocaleString('ru-RU') + ' ₽';
    }

    // Создаем сегменты круга
    createCircleSegments(companies, totalAmount);
    
    // Создаем легенду
    createExpensesLegend(companies);
});

function createCircleSegments(companies, totalAmount) {
    const svg = document.querySelector('.circle-chart-svg');
    if (!svg) return;
    
    const circumference = 2 * Math.PI * 15.9155;
    let accumulatedPercentage = 0;

    // Очищаем существующие сегменты
    const existingSegments = document.querySelectorAll('.circle-segment');
    existingSegments.forEach(segment => segment.remove());

    companies.forEach((company, index) => {
        const percentage = (company.amount / totalAmount) * 100;
        const dashLength = (percentage / 100) * circumference;
        const offset = (accumulatedPercentage / 100) * circumference;

        // Создаем сегмент
        const segment = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        segment.classList.add('circle-segment');
        segment.setAttribute('stroke', company.color);
        segment.setAttribute('stroke-dasharray', `0 ${circumference}`);
        segment.setAttribute('stroke-dashoffset', -offset);
        segment.setAttribute('d', `M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`);
        
        svg.appendChild(segment);

        // Анимируем сегмент
        setTimeout(() => {
            segment.style.strokeDasharray = `${dashLength} ${circumference}`;
        }, index * 100);

        accumulatedPercentage += percentage;
    });
}

function createExpensesLegend(companies) {
    const legendContainer = document.querySelector('.expenses-legend');
    if (!legendContainer) return;
    
    // Сортируем компании по убыванию суммы
    const sortedCompanies = [...companies].sort((a, b) => b.amount - a.amount);
    
    const totalAmount = companies.reduce((sum, company) => sum + company.amount, 0);
    
    sortedCompanies.forEach(company => {
        const percentage = ((company.amount / totalAmount) * 100).toFixed(1);
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${company.color}"></div>
            <div class="legend-name">${company.name}</div>
            <div class="legend-amount">${company.amount.toLocaleString('ru-RU')} ₽</div>
            <div class="legend-percentage">${percentage}%</div>
        `;
        
        legendContainer.appendChild(legendItem);
    });
}