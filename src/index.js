

// import { fetchImages } from './fetchImages';

import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";

import './css/styles.css';
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('form input'),
  searchButton: document.querySelector('form button'),
  gallery: document.querySelector('.gallery'),
};

let currentPage = 1;
let perPage = 40;
let search = '';
let numOfElements;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onInputSearce);
refs.searchInput.addEventListener('input', handleInput);
// refs.searchButton.addEventListener('click', handleSubmit);


async function fetchImages(nameSearch) {
  const KEY = '29269243-d9d53679d5364662a1466d514';
  const URL = 'https://pixabay.com/api/';
  
  const response = await axios.get(`${URL}`, {
    params: {
      key: `${KEY}`,
      q: `${nameSearch}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: `${currentPage}`,
      per_page: `${perPage}`,
    }
  });

  console.log("RESPONSE", response);

  let totalHits = await response.data.totalHits;

  if (totalHits > 0 && currentPage === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } else if (totalHits === numOfElements) {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }

    console.log(currentPage);
  if (totalHits === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  } else if (totalHits > 0) {
    return response;
  }
}


function handleInput(e) {
  if (e.target.value.length > 0) {
    refs.searchButton.disabled = false;
  }
}

function onInputSearce(e) {
  e.preventDefault();
  refs.searchButton.disabled = true;
  refs.gallery.innerHTML = '';
  search = refs.searchInput.value;

  console.log(search);

  fetchImages(search).then(items => {
    console.log(items)
    makeGallery(items);

    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    
  });
  e.target.reset();
}


function makeGallery(items) {
  const allItems = items.data.hits;

  console.log('список картинок', allItems);
  console.log('одна картинка', allItems[0]);

  allItems.map(item => {
    const { comments, downloads, views, tags, webformatURL, largeImageURL } = item;
    const markup = 
    `
    <a class="gallery__item" href="${largeImageURL}"  onclick="event.preventDefault()">
      <div class="photo-card">
        <img class="gallery__image" src="${webformatURL}" alt="${tags}">
        <div class="info">
          <p class="info-item">
            <b>Likes</b> <br> ${comments}
          </p>
          <p class="info-item">
            <b>Views</b> <br> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> <br> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> <br> ${downloads}
          </p>
        </div>
      </div>
    </a>
    `
  ;
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    console.log();
  }
  ).join('');

  numOfElements = document.getElementsByTagName('a').length;
  console.log(numOfElements); 
};


// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });


import debounce from 'lodash.debounce';

// "We're sorry, but you've reached the end of search results.".
window.addEventListener('scroll', debounce(checkPosition, 250))
window.addEventListener('resize', debounce(checkPosition, 250))

function checkPosition() {
  // Нам потребуется знать высоту документа и высоту экрана:
  const height = document.body.offsetHeight
  const screenHeight = window.innerHeight

  // Они могут отличаться: если на странице много контента,
  // высота документа будет больше высоты экрана (отсюда и скролл).

  // Записываем, сколько пикселей пользователь уже проскроллил:
  const scrolled = window.scrollY

  // Обозначим порог, по приближении к которому
  // будем вызывать какое-то действие.
  // В нашем случае — четверть экрана до конца страницы:
  const threshold = height - screenHeight / 4

  // Отслеживаем, где находится низ экрана относительно страницы:
  const position = scrolled + screenHeight

  if (position >= threshold) {
    currentPage += 1;

    fetchImages(refs.searchInput.value).then(items => {
      console.log(items)
      makeGallery(items);
      lightbox.refresh();
    });
  }
}
