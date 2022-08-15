
import './css/styles.css';
import "simplelightbox/dist/simple-lightbox.min.css";

import fetchImages from './fetchImages';

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

// import { galleryItems } from './gallery-items';


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
    lightbox.on('')
  });

  
}




function makeGallery(data) {
  refs.gallery.innerHTML = '';

  console.log('список картинок', data);
  console.log('одна картинка', data.hits[0]);
  
  data.hits.forEach(item => {

    const { comments, downloads, views, tags, webformatURL, largeImageURL } = item;

    // const { largeImageURL, webformatURL } = item.webformatURL;
    // const { user, userImageURL } = item.user;
    // const { userImageURL } = item.user;



    const imageItem = document.createElement('a');
    imageItem.classList.add('gallery__item');
    imageItem.setAttribute('href', `"${largeImageURL}"`);


  imageItem.innerHTML = `
 <div class="photo-card">
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
</div>`
;

    refs.gallery.appendChild(imageItem);
  // refs.searchButton.style.display = 'none';
  // fetchSearchResults(e.target.value);
})
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});



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