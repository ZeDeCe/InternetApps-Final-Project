const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');

const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const twitterClient = client.readWrite;

const uploadImage = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        
        const mediaBuffer = Buffer.from(response.data);

        const mediaId = await twitterClient.v1.uploadMedia(mediaBuffer, {
            mimeType: response.headers['content-type']
        });

        return mediaId;
    } catch (error) {
        return;
    }
}; 

const shareTwitter = async (text, mediaId) => {
    try {
        var body = {
            text: text
        }
        if (mediaId){
            body.media = {media_ids: [mediaId]};
        }
        
        return await twitterClient.v2.tweet(body);
        
        
        
    } catch (error) {
        console.error('Error posting tweet:', error);
        throw error;
    }
};

const shareNewItem = async (product_name, product_image_url, product_link) => {
    try {
       const text = `${product_name} is now available on our site! \n\n${product_link}`
       const mediaId = await uploadImage(product_image_url);
       return await shareTwitter(text, mediaId);

    } catch (error) {
        return;
    }
};

module.exports = {
    shareNewItem
};