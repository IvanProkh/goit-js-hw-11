const KEY = '29269243-d9d53679d5364662a1466d514';
const URL = 'https://pixabay.com/api/';
// const search = document.querySelector('form input');

// const options = {
//     headers: {
//         'X-Auth-Token': API
//     }
// }

export default function fetchImages(img) {
    return fetch (`${URL}?key=${KEY}&q=${img}&image_type=photo`).then(response => {
        //   if (response.status === 200) {
            return response.json();
        //   } else {
        //     return Promise.reject('not found');
        //   }
        });
    }