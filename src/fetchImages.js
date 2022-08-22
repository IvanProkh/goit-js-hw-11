

import Notiflix from 'notiflix';
import axios from 'axios';

let currentPage = 1;
let perPage = 40;

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

  if (totalHits === numOfElements && totalHits > 0) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreButton.classList.toggle('is-hidden');
  }
}

export { fetchImages };
