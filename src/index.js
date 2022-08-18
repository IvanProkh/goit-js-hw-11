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
  gallery: document.querySelector('.gallery'),
};

let currentPage = 1;
let perPage = 40;
let search = '';
let numOfElements;

refs.searchForm.addEventListener('submit', onInputSearce);
refs.searchInput.addEventListener('input', handleInput);
window.addEventListener('scroll', debounce(scrollMakeGallery, 250));

refs.searchButton.disabled = true;

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

  let totalHits = await response.data.totalHits;

  console.log("totalHits", totalHits);
  console.log("currentPage", currentPage);

  if (totalHits > 0 && currentPage === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

  } else if (totalHits <= numOfElements) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;

  } else if (totalHits !== numOfElements) {
    currentPage += 1;
    return response;
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

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
  currentPage = 1;
  numOfElements = 0;

  fetchImages(search)
    .then(items => {
      console.log(items);
      makeGallery(items);
      lightbox.refresh();
    })
    .catch(err => {
      console.log(err);
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
  console.log("к-л созданных элементов", numOfElements);
}

function scrollMakeGallery() {
    const height = document.body.offsetHeight;
    const screenHeight = window.innerHeight;

    const scrolled = window.scrollY;

    const threshold = height - screenHeight / 4;

    const position = scrolled + screenHeight;

    if (position >= threshold) {

      fetchImages(search)
        .then(items => {
          console.log(items);
          makeGallery(items);
          lightbox.refresh();

          const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
        })
        .catch(err => {
          console.log(err);
        });
  }
}



// let q = await response.config.params.q;
// console.log('q', q);