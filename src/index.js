

import { fetchImages } from './fetchImages';

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
console.log(refs);

const KEY = '29269243-d9d53679d5364662a1466d514';
const URL = 'https://pixabay.com/api/';

let lightbox;

refs.searchForm.addEventListener('submit', onInputSearce);
refs.searchInput.addEventListener('input', handleInput);
// refs.searchButton.addEventListener('click', handleSubmit);

// async function fetchImages(img) {
//   const server = `${URL}?key=${KEY}&q=${img}&image_type=photo`;
//   const response = await axios.get(server);
//   console.log("~ response", response)
//   // const data = await response.json();
//   const data = response.data;

//   console.log("~ data", data)

//   if (response.ok) {
//       return data;
//   } else {
//   // throw new Error(data.message);
//   }
// }


function handleInput(e) {
  console.log(e.target.value);
}

function onInputSearce(e) {
  e.preventDefault();

  console.log(refs.searchInput.value);

  fetchImages(refs.searchInput.value).then(data => {
    console.log(data)
    makeGallery(data);
    // lightbox.on()
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    
  });

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}




function makeGallery(data) {
  refs.gallery.innerHTML = '';

  console.log('список картинок', data);
  console.log('одна картинка', data.hits[0]);


  data.hits.map(item => {
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
  }
  ).join('');
};





// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });