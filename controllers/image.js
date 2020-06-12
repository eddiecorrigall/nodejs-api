const url = require('url');
const fetch = require('node-fetch');

const {
    IntegrationError,
    ParseError,
} = require('../errors/app-error');


class Image {
    constructor({href, id, width, height, format}) {
        this.href = href;
        this.id = id;
        this.width = width;
        this.height = height;
        this.format = format;
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


exports.getRandomImage = async ({ width = 100, height = 100 }) => {
    const requestUri = `https://picsum.photos/${width}/${height}`;
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
