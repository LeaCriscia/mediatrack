const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const jsonData = JSON.parse(fs.readFileSync('./output.json', 'utf8'));

const url="https://play.tv2bornholm.dk/?area=specifikTV&serienavn=Nyheder";
const media_data = []

async function getMedias(url){
    try{
        const response = await axios.get(url);
        const $ =cheerio.load(response.data);

        const medias = $(".video");
        medias.each(function(){
            headline = $(this).find(".titel").text();
            publish_date = $(this).find(".videodato").text().slice(0, 10);
            time_start = '00:00'
            time_end = $(this).find(".videodato").text().slice(-5);
            player = $(this).find("a").text();

            const stream_url = {
                '19.30Nyheder 17.11.2023, 19:30Hele udsendelsen.': 'https://vod.tv2bornholm.dk/vod/mp4:B058853_1280x720_20231117-195042.mp4/chunklist.m3u8',
                '18Nyheder 17.11.2023, 18:00Hele udsendelsen.': 'https://vod.tv2bornholm.dk/vod/mp4:B058455_1280x720_20231117-180425.mp4/chunklist.m3u8',
                '17Nyheder 17.11.2023, 17:00Hele udsendelsen.': 'https://vod.tv2bornholm.dk/vod/mp4:B057724_1280x720_20231117-170509.mp4/chunklist.m3u8',
                '22Nyheder 16.11.2023, 22:00Hele udsendelsen.': 'https://vod.tv2bornholm.dk/vod/mp4:B059125_1280x720_20231116-221636.mp4/chunklist.m3u8',
                '19.30Nyheder 16.11.2023, 19:30Hele udsendelsen.': 'https://vod.tv2bornholm.dk/vod/mp4:B058852_1280x720_20231116-195544.mp4/chunklist.m3u8'
            };
            
            const currentStreamUrl = stream_url[player];

            const hrefValues = [];
            $(this).find('a').each((id, element) => {
            const href = $(element).attr('href');
            if (href) {
            hrefValues.push(href);
            }});
          
            const segment = JSON.stringify(jsonData);

            media_data.push({
                headline, 
                publish_date, 
                time_start, 
                time_end,
                stream_url: currentStreamUrl,
                episode_url: hrefValues,
                segment
            });
        });

        media_data.splice(-5);

        console.log(media_data);
    }
    catch(error){
        console.error(error);
    }
}

getMedias(url);