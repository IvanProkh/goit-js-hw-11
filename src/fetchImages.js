// const KEY = '29269243-d9d53679d5364662a1466d514';
// const URL = 'https://pixabay.com/api/';

// const options = {
//     method: 'GET',
// }

// async function fetchImages(img) {
//     const server = `${URL}?key=${KEY}&q=${img}&image_type=photo`;
//     const response = await fetch(server, options);
//     const data = await response.json();

//     if (response.ok) {
//         return data;
//     } else {
//     throw new Error(data.message);
//     }
// }



// export { fetchImages };


import Notiflix from 'notiflix';
import axios from "axios";


let currentPage = 1;
let perPage = 40;
let lightbox;


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
  
    let totalHits = response.data.totalHits;
  
    if (totalHits === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else if (totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      return response;
    }
  }



  
export { fetchImages };