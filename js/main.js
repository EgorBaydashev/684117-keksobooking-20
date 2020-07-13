'use strict';

var ADS_QUANTITY = 8;
var TITLES = ['Дом', 'Апартаменты', 'Квартира', 'Студия', 'Квартира-студия', 'Пентхаус', 'Штаб-квартира', 'Резиденция'];
var PIN_X_MIN = 0;
var PIN_X_MAX = 1200;
var PIN_Y_MIN = 130;
var PIN_Y_MAX = 630;
var MIN_PRICE = 0;
var MAX_PRICE = 1000000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS = [1, 2, 3, 4, 5];
var GUESTS = [1, 2, 3, 4, 5, 6, 7, 8];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = 'Лучший вариант на сегодняшний день!';
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_X_OFFSET = 50;
var PIN_Y_OFFSET = 70;

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomValueFromArray = function (arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
};

var getArrRandomLength = function (arr) {
  var result = [];
  var j = getRandomNumber(1, arr.length);
  for (var i = 0; i < j; i++) {
    var element = arr[i];
    result.push(element);
  }
  return result;
};

var getData = function () {
  var randomArr = [];

  for (var i = 1; i <= ADS_QUANTITY; i++) {
    var ad = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        title: getRandomValueFromArray(TITLES),
        address: '',
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: getRandomValueFromArray(TYPES),
        rooms: getRandomValueFromArray(ROOMS),
        guests: getRandomValueFromArray(GUESTS),
        checkin: getRandomValueFromArray(CHECKIN),
        checkout: getRandomValueFromArray(CHECKOUT),
        features: getArrRandomLength(FEATURES),
        description: DESCRIPTION,
        photos: getArrRandomLength(PHOTOS)
      },
      location: {
        x: getRandomNumber(PIN_X_MIN, PIN_X_MAX),
        y: getRandomNumber(PIN_Y_MIN, PIN_Y_MAX)
      }
    };
    ad.offer.address = ad.location.x + ',' + ad.location.y;
    randomArr.push(ad);
  }
  return randomArr;
};

var similarPinList = document.querySelector('.map__pins');
var similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var resultData = getData();

var renderPin = function (ad) {
  var pinElement = similarPinTemplate.cloneNode(true);

  pinElement.style = 'left: ' + (ad.location.x + PIN_X_OFFSET) + 'px; top: ' + (ad.location.y + PIN_Y_OFFSET) + 'px';
  pinElement.querySelector('img').src = ad.author.avatar;
  pinElement.querySelector('img').alt = ad.offer.title;

  return pinElement;
};

var renderPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < resultData.length; i++) {
    fragment.appendChild(renderPin(resultData[i]));
  }
  similarPinList.appendChild(fragment);
};

getData();
renderPins();

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var typesOffers = {
  palace: {
    ru: 'Дворец'
  },
  flat: {
    ru: 'Квартира'
  },
  house: {
    ru: 'Дом'
  },
  bungalo: {
    ru: 'Бунгало'
  }
};

var filtersContainer = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var getNoun = function (number, one, two, many) {
  number = Math.abs(number);
  number %= 100;
  if (number >= 5 && number <= 20) {
    return number + many;
  }
  number %= 10;
  if (number === 1) {
    return number + one;
  }
  if (number >= 2 && number <= 4) {
    return number + two;
  }
  return number + many;
};

var getCard = function (value) {
  var cardElement = cardTemplate.cloneNode(true);

  var photoElement = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = value.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = value.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = value.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = typesOffers[value.offer.type].ru;
  cardElement.querySelector('.popup__text--capacity').textContent = getNoun(value.offer.rooms, ' комната для ', ' комнаты для ', ' комнат для ') + getNoun(value.offer.guests, ' гостя', ' гостей', ' гостей');
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + value.offer.checkin + ', выезд до ' + value.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = value.offer.description;
  cardElement.querySelector('.popup__avatar').setAttribute('src', value.author.avatar);
  cardElement.querySelectorAll('.popup__features').textContent = value.offer.features;
  photoElement.querySelector('img').src = value.offer.photos[0];

  return cardElement;
};

map.insertBefore(getCard(resultData[0]), filtersContainer);
