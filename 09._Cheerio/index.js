import fs from 'fs';
import { load } from 'cheerio';

// const response = await fetch("https://www.proshop.dk/Baerbar-computer");
// const result = await response.text();

// fs.writeFileSync("proshop.html", result);

const htmlPageString = fs.readFileSync("proshop.html").toString();

const $ = load(htmlPageString);
$("#products [product]").each((index, element) => {
    const name = $(element).find(".site-product-link h2").text();
    const description = $(element).find(".site-product-link").text();
    const price = $(element).find(".site-currency-lg").text();
    
    console.log(name);
    console.log(price);
});

