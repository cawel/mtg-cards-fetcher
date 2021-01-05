const Scry = require("scryfall-sdk");
const { downloadFile } = require("./downloadFile");

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const cardSet = "znr";
let cards = [];
let cardsWithoutImages = [];

// download all PNG images from a particular set
Scry.Cards.search(`set:${cardSet}`)
  .on("data", async (card) => {
    if (card.image_uris && card.image_uris.png) {
      cards.push({ url: card.image_uris.png, name: card.name });
    } else {
      cardsWithoutImages.push(card.name);
    }
  })
  .on("end", async () => {
    console.log("done");
    console.log(`Found ${Object.keys(cards).length} cards.`);
    console.log(`Found ${cardsWithoutImages.length} w/o image URL's.`);

    // throttle API requests as per Scryfall request
    for (const { url, name } of cards) {
      console.log(`Downloading ${name} – ${url}`);
      await sleep(100);
      await downloadFile(url, `output/${cardSet}/${name}.png`);
    }
  });
