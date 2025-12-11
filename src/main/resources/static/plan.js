// Данные мероприятий (сохраняются в localStorage)
let events = JSON.parse(localStorage.getItem('hikeEvents')) || [
    {
        id: 1,
        title: 'Национальный музей Республики Коми',
        date: '2025-07-12',
        location: 'ул. Коммунистическая, центр города',
        groupSize: 'medium',
        description: 'Экскурсия по экспозициям музея: история, этнография и природа Коми. Подходит для тех, кто интересуется культурой региона. Включает гида и время для самостоятельного осмотра.',
        completed: false
    },
    {
        id: 2,
        title: 'Набережная реки Сысола — вечерняя прогулка',
        date: '2025-07-19',
        location: 'Набережная Сысолы, рядом с парком',
        groupSize: 'small',
        description: 'Неспешная прогулка по набережной с видом на реку, фото-стопы и рассказ о городской архитектуре. Легкий маршрут, подходит для всей семьи.',
        completed: false
    },
    {
        id: 3,
        title: 'Городской парк культуры и отдыха — пикник и игры',
        date: '2025-07-26',
        location: 'Городской парк (парк им. С. Кирова)',
        groupSize: 'large',
        description: 'Дневной выезд в парк: пикник, подвижные игры, мини-квесты для участников. Подходит для тех, кто любит активный, но спокойный отдых на природе.',
        completed: false
    },
    {
        id: 4,
        title: 'Государственный театр оперы и балета Республики Коми — вечерние представления',
        date: '2025-08-02',
        location: 'ул. Катаева, театр',
        groupSize: 'medium',
        description: 'Совместный поход на спектакль с последующим обсуждением в кафе. Подходит тем, кто интересуется культурной жизнью города.',
        completed: false
    }
];

// Текущая дата и выбранная дата
let currentDate = new Date();
let selectedDate = new Date('2025-07-19');
let editingEventId = null;

// DOM элементы
const calendarBody = document.getElementById('calendar-body');
const currentMonthYear = document.getElementById('current-month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const selectedDateInfo = document.getElementById('selected-date-info');
const hikeList = document.getElementById('hike-list');
const searchInput = document.getElementById('searchEvents');
const filterButtons = document.querySelectorAll('.filter-btn');
const addEventBtn = document.getElementById('addEventBtn');
const addToDateBtn = document.getElementById('addToDateBtn');
const modalOverlay = document.getElementById('modalOverlay');
const addEventModal = document.getElementById('addEventModal');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const eventForm = document.getElementById('eventForm');
const eventDateInput = document.getElementById('eventDate');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    renderEvents();
    updateSelectedDateInfo();
    setupEventListeners();
    
    // Установить сегодняшнюю дату в поле даты формы
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.value = today;
    eventDateInput.min = today;
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки переключения месяцев
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Кнопка добавления мероприятия
    addEventBtn.addEventListener('click', () => {
        editingEventId = null;
        resetEventForm();
        openModal();
    });
    
    // Кнопка добавления на выбранную дату
    addToDateBtn.addEventListener('click', () => {
        editingEventId = null;
        resetEventForm();
        eventDateInput.value = formatDateForInput(selectedDate);
        openModal();
    });
    
    // Закрытие модального окна
    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Обработка формы
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveEvent();
    });
    
    // Поиск мероприятий
    searchInput.addEventListener('input', filterEvents);
    
    // Фильтры
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterEvents();
        });
    });
}

// Рендеринг календаря
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Обновление заголовка
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    currentMonthYear.textContent = `${monthNames[month]} ${year}`;
    
    // Очистка календаря
    calendarBody.innerHTML = '';
    
    // Первый день месяца
    const firstDay = new Date(year, month, 1);
    // Последний день месяца
    const lastDay = new Date(year, month + 1, 0);
    // День недели первого дня
    const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    // Дата начала календаря
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDayIndex);
    
    let currentRow = document.createElement('tr');
    let currentDateCell = new Date(startDate);
    
    // Создание календаря
    for (let i = 0; i < 42; i++) { // 6 недель
        if (i > 0 && i % 7 === 0) {
            calendarBody.appendChild(currentRow);
            currentRow = document.createElement('tr');
        }
        
        const cell = document.createElement('td');
        const cellDate = new Date(currentDateCell);
        const dateString = formatDate(cellDate);
        
        cell.textContent = cellDate.getDate();
        cell.dataset.date = dateString;
        
        // Проверка на другой месяц
        if (cellDate.getMonth() !== month) {
            cell.classList.add('other-month');
        }
        
        // Проверка на сегодня
        const today = new Date();
        if (isSameDay(cellDate, today)) {
            cell.classList.add('today');
        }
        
        // Проверка на выбранную дату
        if (isSameDay(cellDate, selectedDate)) {
            cell.classList.add('selected');
        }
        
        // Проверка на наличие мероприятий
        if (hasEventsOnDate(cellDate)) {
            cell.classList.add('event-day');
        }
        
        // Обработчик клика
        cell.addEventListener('click', () => {
            selectedDate = cellDate;
            renderCalendar();
            updateSelectedDateInfo();
            filterEvents();
        });
        
        currentRow.appendChild(cell);
        currentDateCell.setDate(currentDateCell.getDate() + 1);
    }
    
    calendarBody.appendChild(currentRow);
}

// Рендеринг списка мероприятий
function renderEvents() {
    hikeList.innerHTML = '';
    
    // Сортировка мероприятий по дате
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    events.forEach(event => {
        const eventDate = new Date(event.date);
        const eventElement = createEventElement(event);
        hikeList.appendChild(eventElement);
    });
}

// Создание элемента мероприятия
function createEventElement(event) {
    const li = document.createElement('li');
    li.className = `hike-item ${event.completed ? 'completed' : ''}`;
    li.dataset.id = event.id;
    li.dataset.date = event.date;
    
    // Форматирование даты
    const eventDate = new Date(event.date);
    const dateString = formatDateForDisplay(eventDate);
    
    // Форматирование размера группы
    const groupSizeText = getGroupSizeText(event.groupSize);
    
    li.innerHTML = `
        <h3 class="hike-title">
            ${event.title}
            ${event.completed ? '<span class="completed-badge">✓ Завершено</span>' : ''}
            <div class="hike-actions">
                <button class="edit-btn" title="Редактировать"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Удалить"><i class="fas fa-trash"></i></button>
            </div>
        </h3>
        <div class="hike-details">
            <div class="detail-item">
                <span class="detail-icon">📍</span>
                <span>${event.location}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">👥</span>
                <span>${groupSizeText}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">📅</span>
                <span>${dateString}</span>
            </div>
        </div>
        <p class="hike-description">${event.description}</p>
    `;
    
    // Обработчики для кнопок редактирования и удаления
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editEvent(event.id);
    });
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEvent(event.id);
    });
    
    return li;
}

// Обновление информации о выбранной дате
function updateSelectedDateInfo() {
    const dateString = formatDateForDisplay(selectedDate);
    const eventsOnDate = getEventsOnDate(selectedDate);
    
    selectedDateInfo.innerHTML = `
        <div class="date-header">
            <h4>${dateString}</h4>
            <span class="event-count">${eventsOnDate.length} мероприятие${eventsOnDate.length !== 1 ? 'я' : ''}</span>
        </div>
        <div class="events-list">
            ${eventsOnDate.length > 0 ? `
                <p><strong>Запланировано походов:</strong></p>
                <ul>
                    ${eventsOnDate.map(event => `<li>${event.title}</li>`).join('')}
                </ul>
            ` : `
                <p><strong>На эту дату ничего не запланировано</strong></p>
                <p>Добавьте мероприятие, нажав на кнопку ниже</p>
            `}
        </div>
        <button class="add-to-date-btn" id="addToDateBtn">
            <i class="fas fa-calendar-plus"></i> Добавить на эту дату
        </button>
    `;
    
    // Добавляем обработчик для новой кнопки
    document.getElementById('addToDateBtn').addEventListener('click', () => {
        editingEventId = null;
        resetEventForm();
        eventDateInput.value = formatDateForInput(selectedDate);
        openModal();
    });
}

// Фильтрация мероприятий
function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    const eventItems = document.querySelectorAll('.hike-item');
    
    eventItems.forEach(item => {
        const eventId = parseInt(item.dataset.id);
        const event = events.find(e => e.id === eventId);
        
        if (!event) return;
        
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) || 
                            event.description.toLowerCase().includes(searchTerm) ||
                            event.location.toLowerCase().includes(searchTerm);
        
        let matchesFilter = true;
        if (activeFilter === 'upcoming') {
            matchesFilter = !event.completed && new Date(event.date) >= new Date();
        } else if (activeFilter === 'completed') {
            matchesFilter = event.completed;
        }
        
        // Фильтрация по выбранной дате
        const matchesDate = isSameDay(new Date(event.date), selectedDate);
        
        if (matchesSearch && matchesFilter && matchesDate) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Открытие модального окна
function openModal() {
    modalOverlay.style.display = 'block';
    addEventModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeModal() {
    modalOverlay.style.display = 'none';
    addEventModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetEventForm();
}

// Сброс формы
function resetEventForm() {
    eventForm.reset();
    document.getElementById('eventTitle').focus();
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.value = today;
    eventDateInput.min = today;
    editingEventId = null;
}

// Сохранение мероприятия
function saveEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value.trim();
    const groupSize = document.getElementById('eventGroupSize').value;
    const description = document.getElementById('eventDescription').value.trim();
    const completed = document.getElementById('eventCompleted').checked;
    
    if (!title || !date || !location) {
        alert('Пожалуйста, заполните обязательные поля: название, дата и место');
        return;
    }
    
    if (editingEventId) {
        // Редактирование существующего мероприятия
        const eventIndex = events.findIndex(e => e.id === editingEventId);
        if (eventIndex !== -1) {
            events[eventIndex] = {
                ...events[eventIndex],
                title,
                date,
                location,
                groupSize,
                description,
                completed
            };
        }
    } else {
        // Добавление нового мероприятия
        const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
        events.push({
            id: newId,
            title,
            date,
            location,
            groupSize,
            description,
            completed
        });
    }
    
    // Сохранение в localStorage
    localStorage.setItem('hikeEvents', JSON.stringify(events));
    
    // Обновление UI
    renderCalendar();
    renderEvents();
    updateSelectedDateInfo();
    filterEvents();
    
    // Закрытие модального окна
    closeModal();
    
    // Показать уведомление
    showNotification(editingEventId ? 'Мероприятие обновлено!' : 'Мероприятие добавлено!');
}

// Редактирование мероприятия
function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    editingEventId = eventId;
    
    // Заполнение формы
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventGroupSize').value = event.groupSize;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventCompleted').checked = event.completed;
    
    // Открытие модального окна
    openModal();
}

// Удаление мероприятия
function deleteEvent(eventId) {
    if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
        events = events.filter(e => e.id !== eventId);
        
        // Сохранение в localStorage
        localStorage.setItem('hikeEvents', JSON.stringify(events));
        
        // Обновление UI
        renderCalendar();
        renderEvents();
        updateSelectedDateInfo();
        filterEvents();
        
        // Показать уведомление
        showNotification('Мероприятие удалено!');
    }
}

// Вспомогательные функции
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateForDisplay(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('ru-RU', options);
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function hasEventsOnDate(date) {
    return events.some(event => isSameDay(new Date(event.date), date));
}

function getEventsOnDate(date) {
    return events.filter(event => isSameDay(new Date(event.date), date));
}

function getGroupSizeText(groupSize) {
    switch(groupSize) {
        case 'solo': return 'Один/одна';
        case 'small': return 'Малая группа (до 5 чел.)';
        case 'medium': return 'Группа (6-15 чел.)';
        case 'large': return 'Большая группа (15+ чел.)';
        default: return 'Группа';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3498db, #2ecc71);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(52, 152, 219, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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
    
    .completed-badge {
        background: #27ae60;
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
`;
document.head.appendChild(style);