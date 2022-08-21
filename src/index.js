// import { fetchImages } from './fetchImages';

import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import debounce from 'lodash.debounce';

import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('form input'),
  searchButton: document.querySelector('form button'),
  loadMoreButton: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

let currentPage = 1;
let perPage = 40;
let nameSearch = '';
let numOfElements = 0;
let totalHits = 0;

refs.searchForm.addEventListener('submit', onInputSearce);
refs.searchInput.addEventListener('input', handleInput);
refs.loadMoreButton.addEventListener('click', loadMore);
// window.addEventListener('scroll', debounce(scrollMakeGallery, 500));

refs.searchButton.disabled = true;
// refs.loadMoreButton.is-hidden = true;

async function fetchImages(nameSearch) {
  const API_KEY = '29269243-d9d53679d5364662a1466d514';
  const BASE_URL = 'https://pixabay.com/api/';

  const response = await axios.get(`${BASE_URL}`, {
    params: {
      key: `${API_KEY}`,
      q: `${nameSearch}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: `${currentPage}`,
      per_page: `${perPage}`,
    },
  });

  console.log('RESPONSE', response);
  console.log('nameSearch', nameSearch);

  totalHits = await response.data.totalHits;

  console.log('totalHits', totalHits);
  console.log('currentPage', currentPage);

  if (totalHits > 0 && currentPage === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.loadMoreButton.classList.toggle('is-hidden');
  }

  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (totalHits !== numOfElements) {
    currentPage += 1;
    return response;
  }

  if (response.data === '[ERROR 400] "page" is out of valid range.') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (totalHits === numOfElements && totalHits > 0) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreButton.classList.toggle('is-hidden');
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

function handleInput(e) {
  nameSearch = e.target.value.trim().toLowerCase();
  console.log(nameSearch);
  if (nameSearch.length > 0) {
    refs.searchButton.disabled = false;
  } else {
    refs.searchButton.disabled = true;
  }
}

function onInputSearce(e) {
  e.preventDefault();
  refs.searchButton.disabled = true;
  // refs.loadMoreButton.disabled = false;
  refs.gallery.innerHTML = '';
  currentPage = 1;
  numOfElements = 0;
  refs.loadMoreButton.classList.add('is-hidden');

  fetchImages(nameSearch)
    .then(items => {
      console.log(items);
      makeGallery(items);
      lightbox.refresh();
    })
    .catch(err => {
      console.log('Ошибка словлена', err);
      console.log('данные ошибки', err.response.data);

      if (err.response.data === '[ERROR 400] "page" is out of valid range.') {
        Notiflix.Notify.failure('ОШИБКА 400');
      }
    });

  e.target.reset();
}

function makeGallery(items) {
  const allItems = items.data.hits;

  // console.log('список картинок', allItems);
  // console.log('одна картинка', allItems[0]);

  allItems
    .map(item => {
      const { comments, downloads, views, tags, webformatURL, largeImageURL } =
        item;
      const markup = `
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
    `;
      refs.gallery.insertAdjacentHTML('beforeend', markup);
    })
    .join('');

  numOfElements = document.getElementsByTagName('a').length;
  console.log('к-л созданных элементов', numOfElements);
}

// function scrollMakeGallery() {
//     const height = document.body.offsetHeight;
//     const screenHeight = window.innerHeight;

//     const scrolled = window.scrollY;

//     const threshold = height - screenHeight / 4;

//     const position = scrolled + screenHeight;

//     if (position >= threshold && totalHits !== numOfElements) {

//       fetchImages(nameSearch)
//         .then(items => {
//           console.log(items);
//           makeGallery(items);
//           lightbox.refresh();
//           smoothScrollPage()

//         })
//         .catch(err => {
//           console.log(err);
//         });
// }
// }

function loadMore() {
  fetchImages(nameSearch)
    .then(items => {
      console.log(items);
      makeGallery(items);
      lightbox.refresh();
      smoothScrollPage();
    })
    .catch(err => {
      console.log('на кнопке', err.response.data);
      if (err.response.data === '[ERROR 400] "page" is out of valid range.') {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreButton.classList.add('is-hidden');
      }
    });
}

function smoothScrollPage() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  console.log('прокрутка', cardHeight);
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
