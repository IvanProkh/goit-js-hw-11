// В качестве бэкенда используй публичный API сервиса Pixabay. Зарегистрируйся, получи свой уникальный ключ доступа и ознакомься с документацией.

// Список параметров строки запроса которые тебе обязательно необходимо указать:

// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.
// В ответе будет массив изображений удовлетворивших критериям параметров запроса. Каждое изображение описывается объектом, из которого тебе интересны только следующие свойства:

// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.
// Если бэкенд возвращает пустой массив, значит ничего подходящего найдено небыло. В таком случае показывай уведомление с текстом "Sorry, there are no images matching your search query. Please try again.". Для уведомлений используй библиотеку notiflix.

// Элемент div.gallery изначально есть в HTML документе, и в него необходимо рендерить разметку карточек изображений. При поиске по новому ключевому слову необходимо полностью очищать содержимое галереи, чтобы не смешивать результаты.

// Pixabay API поддерживает пагинацию и предоставляет параметры page и per_page. Сделай так, чтобы в каждом ответе приходило 40 объектов (по умолчанию 20).

// Изначально значение параметра page должно быть 1.
// При каждом последующем запросе, его необходимо увеличить на 1.
// При поиске по новому ключевому слову значение page надо вернуть в исходное, так как будет пагинация по новой коллекции изображений.
// В HTML документе уже есть разметка кнопки при клике по которой необходимо выполнять запрос за следующей группой изображений и добавлять разметку к уже существующим элементам галереи.

// <button type="button" class="load-more">Load more</button>
// Изначально кнопка должна быть скрыта.
// После первого запроса кнопка появляется в интерфейсе под галереей.
// При повторном сабмите формы кнопка сначала прячется, а после запроса опять отображается.
// В ответе бэкенд возвращает свойство totalHits - общее количество изображений которые подошли под критерий поиска (для бесплатного аккаунта). Если пользователь дошел до конца коллекции, пряч кнопку и выводи уведомление с текстом "We're sorry, but you've reached the end of search results.".

// После первого запроса при каждом новом поиске выводить уведомление в котором будет написано сколько всего нашли изображений (свойство totalHits). Текст уведомления "Hooray! We found totalHits images."

// Добавить отображение большой версии изображения с библиотекой SimpleLightbox для полноценной галереи.

// В разметке необходимо будет обернуть каждую карточку изображения в ссылку, как указано в документации.
// У библиотеки есть метод refresh() который обязательно нужно вызывать каждый раз после добавления новой группы карточек изображений.
// Для того чтобы подключить CSS код библиотеки в проект, необходимо добавить еще один импорт, кроме того который описан в документации.

// Вместо кнопки «Load more» можно сделать бесконечную загрузку изображений при прокрутке страницы. Мы предоставлям тебе полную свободу действий в реализации, можешь использовать любые библиотеки.

import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import fetchImages from './fetchImages';

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

// import { galleryItems } from './gallery-items';

import debounce from 'lodash.debounce';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('form input'),
  searchButton: document.querySelector('form button'),
  gallery: document.querySelector('.gallery'),
};
console.log(refs);

refs.searchForm.addEventListener('submit', onInputSearce);
refs.searchInput.addEventListener('input', handleInput);
// refs.searchButton.addEventListener('click', handleSubmit);

function handleInput(e) {
  console.log(e.target.value);
}

function onInputSearce(e) {
  e.preventDefault();

  console.log(refs.searchInput.value);

  fetchImages(refs.searchInput.value).then(data => {
    console.log(data)
    makeGallery(data);
  });

  
}

function makeGallery(data) {
  console.log('список картинок', data);
  console.log('список картинок', data.hits[0]);


  const { comments, downloads, views, tags, userImageURL } = data[0];

  refs.gallery.innerHTML = `
 <div class="photo-card">
  <img src="${userImageURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes${comments}</b>
    </p>
    <p class="info-item">
      <b>Views${views}</b>
    </p>
    <p class="info-item">
      <b>Comments${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${downloads}</b>
    </p>
  </div>
</div>`;

  // refs.searchButton.style.display = 'none';
  // fetchSearchResults(e.target.value);
}

// const imagesMarkup = createImageGalleryMarkup(galleryItems);

// refs.gallery.insertAdjacentHTML('beforeend', imagesMarkup);

// const lightbox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
// });

// function createImageGalleryMarkup(galleryItems) {
//   return galleryItems
//     .map(({ preview, original, description }) => {
//       return `
//         <a 
//         class="gallery__item"
//         href="${original}"
//         onclick="event.preventDefault()">
//             <img
//             class="gallery__image"
//             src="${preview}" 
//             alt="${description}"
//             />
//         </a>
//     `;
//     })
//     .join('');
// }





// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });