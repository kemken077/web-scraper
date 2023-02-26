const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

const getCurrencyData = (currencyName, values) => {
  const currency = {
    currencyName,
    values,
  };
  return currency;
};

const parseValue = (value, splitIdentifier) => {
  return value !== '' ? parseFloat(value.split(splitIdentifier)[1]) : null;
};


app.get('/', (req, res) => {
  res.send('Web scraper')
});

app.get('/getDolarPriceArgentina', (req, res) => {
  const url = 'https://www.dolarhoy.com';
  axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      let currencyPrices = [];

      const tilesDolar = $('.tile.is-parent.is-7.is-vertical .tile.is-child', html);
      tilesDolar.each(function() {
        const title = $(this).find('.title').text();
        const valueBuy = parseValue($(this).find('.values .compra').text(), '$');
        const valueSale = parseValue($(this).find('.values .venta').text(), '$');
        const currencyData = getCurrencyData(title, { buy: valueBuy, sale: valueSale});
        currencyPrices.push(currencyData);
      });

      res.send(currencyPrices);

    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
