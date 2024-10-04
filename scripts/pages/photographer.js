//Mettre le code JavaScript lié à la page photographer.html

class Photographer {
    constructor(id, name, city, country, tagline, price, portrait) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.country = country;
        this.tagline = tagline;
        this.price = price;
        this.portrait = portrait;
    }

    // Get photographer's first name
    getFirstName() {
        return this.name.split(' ')[0];
    }

    // Static method to fetch the JSON file with all photographers and media
    static async fetchAllJsonDataArrays() {
        console.log("static async fetchAllJsonDataArrays fetching json");
        try {
            const response = await fetch('data/photographers.json');
        if (!response.ok) {
            throw new Error('Failed to fetch the json file');
        }
        const data = await response.json();
        console.log("data.photographers :",data.photographers);
        console.log("data.media :",data.media);
        return data; // Return all arrays found from the JSON file
        } catch (error) {
            console.error('Error No Array fetched.', error);
            return { noArray : [] }; // Return an empty array in case of error
        }
    }

    // Static method to find a photographer by their id
    static async createPhotographerById(id) {
        const { photographers } = await this.fetchAllJsonDataArrays();
        const photographerData = photographers.find(p => p.id == id);
        if (!photographerData) {
            throw new Error("Photographer not found");
        }
        return new Photographer(
            photographerData.id,
            photographerData.name,
            photographerData.city,
            photographerData.country,
            photographerData.tagline,
            photographerData.price,
            photographerData.portrait
        );
    }
}

class MediaGallery {
    constructor(works, photographerFirstName) {
        this.works = works;
        this.photographerFirstName = photographerFirstName;
    }

    // Static method to fetch all media for a given photographer
    static async getMediaByPhotographerId(photographerId) {
        const { media } = await Photographer.fetchAllJsonDataArrays();
        return media.filter(item => item.photographerId == photographerId);
    }

    // Method to create and display media items in the DOM
    display() {
        const mediaGallery = document.getElementById('media-gallery');
        mediaGallery.innerHTML = ''; // Clear the gallery

        this.works.forEach(item => {
            const mediaItem = document.createElement('div');
            mediaItem.classList.add('media-item');

            if (item.image) {
                const img = document.createElement('img');
                img.setAttribute('src', `assets/Sample_Photos/${this.photographerFirstName}/${item.image}`);
                img.setAttribute('alt', item.title);
                mediaItem.appendChild(img);
            } else if (item.video) {
                const video = document.createElement('video');
                video.setAttribute('controls', true);
                const source = document.createElement('source');
                source.setAttribute('src', `assets/Sample_Photos/${this.photographerFirstName}/${item.video}`);
                source.setAttribute('type', 'video/mp4');
                video.appendChild(source);
                mediaItem.appendChild(video);
            }

            const title = document.createElement('p');
            title.textContent = item.title;
            mediaItem.appendChild(title);

            mediaGallery.appendChild(mediaItem);
        });
    }
}

// Retrieve the photographer id from the URL
function getPhotographerIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function mediaPageInit() {
     // Get photographer's id from URL
    const photographerId = getPhotographerIdFromUrl();
    console.log("mediaPageInit 0: ",photographerId);

    try {
        // Fetch the photographer's data
        const photographer = await Photographer.createPhotographerById(photographerId);
        console.log("mediaPageInit 1 photographer: ",photographer);
        // Fetch the photographer's works
        const photographerWorks = await MediaGallery.getMediaByPhotographerId(photographerId);
        console.log("mediaPageInit 2 media Works: ",photographerWorks);

        // Create a MediaGallery instance
        const mediaGallery = new MediaGallery(photographerWorks, photographer.getFirstName());

        // Display the media
        mediaGallery.display();
    } catch (error) {
        console.error(error);
    }
}

// Add DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    mediaPageInit();
});
