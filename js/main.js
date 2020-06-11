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
var ROOMS = [1, 2, 3];
var GUESTS = [1, 2, 3];
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
