// Map.js - для главной страницы карт (Map.html)
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчики для кнопок "Больше..."
    const buttons = document.querySelectorAll('.map-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonId = this.id;
            let mapType = '';
            
            // Определяем тип карты по ID кнопки
            switch(buttonId) {
                case 'buttonShop':
                    mapType = 'shop';
                    break;
                case 'buttonRestaurants':
                    mapType = 'restaurants';
                    break;
                case 'buttonBusStop':
                    mapType = 'busstop';
                    break;
                case 'buttonTheaterCinema':
                    mapType = 'theatercinema';
                    break;
                case 'buttonHotels':
                    mapType = 'hotels';
                    break;
                case 'buttonMalls':
                    mapType = 'malls';
                    break;
                case 'buttonGasStations':
                    mapType = 'gasstations';
                    break;
                case 'buttonPolyclinics':
                    mapType = 'polyclinics';
                    break;
                case 'buttonSportsCenters':
                    mapType = 'sportscenters';
                    break;
                case 'buttonBeautySalons':
                    mapType = 'beautysalons';
                    break;
                default:
                    mapType = 'shop';
            }
            
            // Переходим на страницу с полноэкранной картой
            window.location.href = `Maps.html?type=${mapType}`;
        });
    });
    
    // Анимация загрузки карточек
    const cards = document.querySelectorAll('.map-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});