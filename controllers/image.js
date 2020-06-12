const url = require('url');
const fetch = require('node-fetch');
const NodeCache = require("node-cache");

const {
    IntegrationError,
    ParseError,
} = require('@errors/app-error');


const imageCache = new NodeCache({
    stdTTL: 60,
    checkperiod: 120,
});

imageCache.on('set', (key, image) => {
    console.log(`Image set with key ${key} and href ${image.href}`);
});

imageCache.on('expired', (key, image) => {
    console.log(`Image expired with key ${key} and href ${image.href}`);
});


class Image {
    constructor({href, id, width, height, format}) {
        this.href = href;
        this.id = id;
        this.width = width;
        this.height = height;
        this.format = format;
    }

    get key() {
        return [this.id, this.width, this.height].join('.');
    }

    serialize() {
        return {
            href: this.href,
            id: this.id,
            width: this.width,
            height: this.height,
            format: this.format,
        };
    }
}


const _getImageFromUri = async (uri) => {
    const requestUri = uri;
    const requestOptions = {
        method: 'GET',
        redirect: 'manual',
    };
    let location;
    try {
        const response = await fetch(requestUri, requestOptions);
        location = response.headers.get('location');
        if (!location) {
            throw new Error('Location is null');
        }
    } catch (err) {
        throw new IntegrationError('Failed to get random image uri')
            .setError(err);
    }
    try {
        const urlObj = url.parse(location);
        const href = urlObj.href;
        let [_empty, _id, id, width, heightAndFormat] = urlObj.pathname.split('/');
        let [height, format] = heightAndFormat.split('.');
        return new Image({
            href,
            id,
            width: parseInt(width),
            height: parseInt(height),
            format,
        });
    } catch (err) {
        throw new ParseError('Failed to parse random image url')
            .setError(err);
    }
};


exports.getRandomImage = async ({ width = 100, height = 100 }) => {
    const image = await _getImageFromUri(`https://picsum.photos/${width}/${height}`);
    imageCache.set(image.key, image);
    return image;
};

exports.getImageById = async ({id, width = 100, height = 100 }) => {
    let image = imageCache.get(`${id}.${width}.${height}`);
    if (image === undefined) {
        image = await _getImageFromUri(`https://picsum.photos/id/${id}/${width}/${height}`);
        imageCache.set(image.key, image);
    }
    return image;
};

exports.flushImageCache = async () => {
    imageCache.flushAll();
};
