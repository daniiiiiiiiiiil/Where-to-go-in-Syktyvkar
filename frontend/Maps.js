// Данные для разных карт
const mapsData = {
    // Продуктовые магазины
    'shop': {
        title: 'Продуктовые магазины',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor',
        description: 'Карта всех продуктовых магазинов в городе Сыктывкар. Найдите ближайшие супермаркеты, мини-маркеты и продуктовые магазины.',
        address: 'Советская ул., 58, Сыктывкар',
        storesCount: '10+ магазинов',
        distanceInfo: 'В 300м от вас'
    },
    
    // Рестораны и кафе
    'restaurants': {
        title: 'Кафе и Рестораны',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor',
        description: 'Лучшие рестораны, кафе, бары и кофейни в Сыктывкаре. От бюджетных заведений до премиум-ресторанов.',
        address: 'Интернациональная ул., 126, Сыктывкар',
        storesCount: '25+ заведений',
        distanceInfo: 'В 100м от вас'
    },
    
    // Автобусные остановки
    'busstop': {
        title: 'Автобусные остановки',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor',
        description: 'Все автобусные остановки и маршруты общественного транспорта в Сыктывкаре.',
        address: 'Октябрьский просп., 93, Люберцы',
        storesCount: '50+ остановок',
        distanceInfo: 'В 30м от вас'
    },
    
    // Театры и кинотеатры
    'theatercinema': {
        title: 'Театры и Кинотеатры',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A1aa99bfe0131e40f0ee2a64429396786b708d23a27f0796101b02ba80e62f5ae&amp;source=constructor',
        description: 'Культурные места города: театры, кинотеатры, концертные залы и культурные центры.',
        address: 'Октябрьский просп., 141, корп. 5, Сыктывкар',
        storesCount: '8+ мест',
        distanceInfo: 'В 210м от вас'
    },
    
    // Отели
    'hotels': {
        title: 'Отели и Гостиницы',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor',
        description: 'Отели, гостиницы, хостелы и другие места для проживания в Сыктывкаре.',
        address: 'Коммунистическая ул., 67, Сыктывкар',
        storesCount: '15+ отелей',
        distanceInfo: 'В 430м от вас'
    },
    
    // Торговые центры
    'malls': {
        title: 'ТЦ и Торговые центры',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor',
        description: 'Торговые центры, магазины одежды, обуви, электроники и других товаров.',
        address: 'Коммунистическая ул., 50, Сыктывкар',
        storesCount: '7+ ТЦ',
        distanceInfo: 'В 180м от вас'
    },
    
    // АЗС
    'gasstations': {
        title: 'Автозаправочные станции',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor',
        description: 'АЗС различных брендов: Лукойл, Газпромнефть, Роснефть и другие.',
        address: 'ул. Пушкина, 85, Сыктывкар',
        storesCount: '12+ АЗС',
        distanceInfo: 'В 90м от вас'
    },
    
    // Поликлиники
    'polyclinics': {
        title: 'Поликлиники и Медицинские центры',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor',
        description: 'Государственные и частные медицинские учреждения, поликлиники, диагностические центры.',
        address: 'Коммунистическая ул., 41, Сыктывкар',
        storesCount: '10+ учреждений',
        distanceInfo: 'В 320м от вас'
    },
    
    // Спортзалы
    'sportscenters': {
        title: 'Спортзалы и Фитнес-клубы',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor',
        description: 'Фитнес-клубы, спортивные залы, бассейны и спортивные площадки.',
        address: 'Советская ул., 8, Сыктывкар',
        storesCount: '15+ залов',
        distanceInfo: 'В 250м от вас'
    },
    
    // Салоны красоты
    'beautysalons': {
        title: 'Салоны красоты',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor',
        description: 'Салoны красоты, парикмахерские, спа-салоны и косметологические центры.',
        address: 'Советская ул., 16, Сыктывкар',
        storesCount: '20+ салонов',
        distanceInfo: 'В 120м от вас'
    }
};

// Функция для получения параметра из URL
function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Загрузка карты при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const mapType = getUrlParameter('type') || 'shop';
    const mapData = mapsData[mapType];
    
    if (mapData) {
        // Обновление заголовка
        document.getElementById('mapTitle').textContent = mapData.title;
        
        // Создание iframe с картой
        const mapContainer = document.getElementById('fullMap');
        mapContainer.innerHTML = `
            <iframe 
                src="${mapData.iframeSrc}" 
                width="100%" 
                height="100%" 
                frameborder="0"
                allowfullscreen="true"
                style="border: none;"
            ></iframe>
        `;
        
        // Обновление информации
        document.getElementById('mapDescription').textContent = mapData.description;
        document.getElementById('mapAddress').textContent = mapData.address;
        document.getElementById('storesCount').textContent = mapData.storesCount;
        document.getElementById('distanceInfo').textContent = mapData.distanceInfo;
        
        // Обновление title страницы
        document.title = `${mapData.title} | FinTrack`;
    } else {
        // Если тип карты не найден, показываем карту по умолчанию
        document.getElementById('mapTitle').textContent = 'Карта';
        document.getElementById('mapDescription').textContent = 'Интерактивная карта города';
        document.getElementById('mapAddress').textContent = 'Сыктывкар';
        
        const mapContainer = document.getElementById('fullMap');
        mapContainer.innerHTML = `
            <iframe 
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A5a0cbebf09d9fb051950519d86f1a0aff37a7ef146b99668c2f51266e8bf0b9c&amp;source=constructor" 
                width="100%" 
                height="100%" 
                frameborder="0"
                allowfullscreen="true"
                style="border: none;"
            ></iframe>
        `;
    }
    
    // Добавление анимации загрузки
    setTimeout(() => {
        const mapContainer = document.getElementById('fullMap');
        mapContainer.style.opacity = '1';
        mapContainer.style.transform = 'translateY(0)';
    }, 100);
});