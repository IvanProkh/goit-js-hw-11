

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

  // let totalHits = await response.data.totalHits;
  totalHits = await response.data.totalHits;

  let q = await response.config.params.q;
  console.log('q', q);

  if (totalHits > 0 && currentPage === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  // if (totalHits = perPage) {
  //   Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  // }

  console.log(totalHits);
  console.log(currentPage);
  console.log(perPage);

  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (totalHits <= numOfElements) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  } else if (totalHits > 0) {
    currentPage += 1;
    return response;
  }
}

export { fetchImages };
