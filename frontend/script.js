document.addEventListener('DOMContentLoaded', function() {
    // Данные походов
    const hikes = [
        {
            title: "Национальный музей Республики Коми",
            date: "2025-07-12",
            location: "ул. Коммунистическая, центр города",
            group: "Группа (8–15 человек)",
            description: "Экскурсия по экспозициям музея: история, этнография и природа Коми. Подходит для тех, кто интересуется культурой региона. Включает гида и время для самостоятельного осмотра."
        },
        {
            title: "Набережная реки Сысола — вечерняя прогулка",
            date: "2025-07-19",
            location: "Набережная Сысолы, рядом с парком",
            group: "Малая группа (до 10 человек)",
            description: "Неспешная прогулка по набережной с видом на реку, фото-стопы и рассказ о городской архитектуре. Легкий маршрут, подходит для всей семьи."
        },
        {
            title: "Городской парк культуры и отдыха — пикник и игры",
            date: "2025-07-26",
            location: "Городской парк (парк им. С. Кирова)",
            group: "Открытая группа (до 20 человек)",
            description: "Дневной выезд в парк: пикник, подвижные игры, мини-квесты для участников. Подходит для тех, кто любит активный, но спокойный отдых на природе."
        },
        {
            title: "Государственный театр оперы и балета Республики Коми — вечерние представления",
            date: "2025-08-02",
            location: "ул. Катаева, театр",
            group: "Группа (6–12 человек)",
            description: "Совместный поход на спектакль с последующим обсуждением в кафе. Подходит тем, кто интересуется культурной жизнью города."
        }
    ];

    // Текущая дата
    let currentDate = new Date(2025, 6, 1); // Июль 2025
    let selectedDate = null;

    // Элементы DOM
    const calendarBody = document.getElementById('calendar-body');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const selectedDateInfo = document.getElementById('selected-date-info');
    const hikeList = document.getElementById('hike-list');

    // Инициализация календаря
    function initCalendar() {
        renderCalendar();
        updateHikesList();
        setupEventListeners();
    }

    // Рендер календаря
    function renderCalendar() {
        // Очищаем календарь
        calendarBody.innerHTML = '';
        
        // Обновляем заголовок
        updateMonthYear();
        
        // Получаем первый день месяца и день недели
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Приводим к Пн=0
        
        // Получаем количество дней в месяце
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        
        // Получаем количество дней в предыдущем месяце
        const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        
        let calendarHTML = '';
        let dayCount = 1;
        let nextMonthDayCount = 1;
        
        // Создаем 6 строк (недель) по 7 дней
        for (let week = 0; week < 6; week++) {
            calendarHTML += '<tr>';
            
            for (let day = 0; day < 7; day++) {
                let dayNumber;
                let className = '';
                let fullDate;
                
                // Дни предыдущего месяца
                if (week === 0 && day < startingDay) {
                    dayNumber = prevMonthDays - startingDay + day + 1;
                    className = 'other-month';
                    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, dayNumber);
                    fullDate = formatDate(prevMonthDate);
                }
                // Дни текущего месяца
                else if (dayCount <= daysInMonth) {
                    dayNumber = dayCount;
                    fullDate = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCount));
                    
                    // Проверяем, является ли день сегодняшним
                    const today = new Date();
                    if (today.getFullYear() === currentDate.getFullYear() && 
                        today.getMonth() === currentDate.getMonth() && 
                        today.getDate() === dayCount) {
                        className += ' today';
                    }
                    
                    // Проверяем, есть ли поход в этот день
                    if (hasHikeOnDate(fullDate)) {
                        className += ' hike-day';
                    }
                    
                    // Проверяем, выбрана ли эта дата
                    if (selectedDate && formatDate(selectedDate) === fullDate) {
                        className += ' selected';
                    }
                    
                    dayCount++;
                }
                // Дни следующего месяца
                else {
                    dayNumber = nextMonthDayCount;
                    className = 'other-month';
                    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextMonthDayCount);
                    fullDate = formatDate(nextMonthDate);
                    nextMonthDayCount++;
                }
                
                calendarHTML += `<td class="${className}" data-date="${fullDate}">${dayNumber}</td>`;
            }
            
            calendarHTML += '</tr>';
            
            // Прерываем цикл, если все дни месяца отрисованы
            if (dayCount > daysInMonth && nextMonthDayCount > 7) {
                break;
            }
        }
        
        calendarBody.innerHTML = calendarHTML;
        
        // Добавляем обработчики кликов на дни
        document.querySelectorAll('#calendar-body td').forEach(cell => {
            cell.addEventListener('click', function() {
                selectDate(this.getAttribute('data-date'));
            });
        });
    }

    // Обновление заголовка месяца и года
    function updateMonthYear() {
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        
        const year = currentDate.getFullYear();
        const month = monthNames[currentDate.getMonth()];
        
        currentMonthYear.textContent = `${month} ${year}`;
    }

    // Проверка, есть ли поход в указанную дату
    function hasHikeOnDate(date) {
        return hikes.some(hike => hike.date === date);
    }

    // Форматирование даты в YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Выбор даты
    function selectDate(dateString) {
        selectedDate = new Date(dateString);
        
        // Обновляем календарь
        renderCalendar();
        
        // Обновляем информацию о выбранной дате
        updateSelectedDateInfo();
        
        // Фильтруем список походов
        updateHikesList();
    }

    // Обновление информации о выбранной дате
    function updateSelectedDateInfo() {
        if (!selectedDate) {
            selectedDateInfo.innerHTML = '<p>Выберите дату для просмотра событий</p>';
            return;
        }
        
        const formattedDate = selectedDate.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const hikesOnSelectedDate = hikes.filter(hike => hike.date === formatDate(selectedDate));
        
        let infoHTML = '';
        
        if (hikesOnSelectedDate.length > 0) {
            infoHTML = `
                <div>
                    <h4>${formattedDate}</h4>
                    <p>Запланировано походов: <span class="event-count">${hikesOnSelectedDate.length}</span></p>
                    <p>${hikesOnSelectedDate.map(hike => hike.title).join(', ')}</p>
                </div>
            `;
        } else {
            infoHTML = `
                <div>
                    <h4>${formattedDate}</h4>
                    <p>На эту дату походы не запланированы</p>
                </div>
            `;
        }
        
        selectedDateInfo.innerHTML = infoHTML;
    }

    // Обновление списка походов
    function updateHikesList() {
        const hikeItems = document.querySelectorAll('.hike-item');
        
        hikeItems.forEach(item => {
            const hikeDate = item.getAttribute('data-date');
            
            if (selectedDate) {
                if (hikeDate === formatDate(selectedDate)) {
                    item.classList.remove('hidden', 'filtered-out');
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                } else {
                    item.classList.add('filtered-out');
                    item.classList.remove('hidden');
                }
            } else {
                item.classList.remove('hidden', 'filtered-out');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Кнопки навигации по месяцам
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        // Выбор сегодняшней даты по двойному клику на заголовке
        currentMonthYear.addEventListener('dblclick', () => {
            currentDate = new Date();
            selectedDate = new Date();
            renderCalendar();
            updateSelectedDateInfo();
            updateHikesList();
        });
    }

    // Запуск приложения
    initCalendar();
});