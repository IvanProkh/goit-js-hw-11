const KEY = '29269243-d9d53679d5364662a1466d514';
const URL = 'https://pixabay.com/api/';

const options = {
    method: 'GET',
}

async function fetchImages(img) {
    const server = `${URL}?key=${KEY}&q=${img}&image_type=photo`;
    const response = await fetch(server, options);
    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
    throw new Error(data.message);
    }
}



export { fetchImages };


