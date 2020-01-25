const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore-data');
const app = express();

app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  // VALIDATION
  const {sort, genre} = req.query;
  let sortFormatted;
  let genreFormatted;
  if (sort) {
    sortFormatted = sort[0].toUpperCase() + sort.slice(1).toLowerCase();
  }
  if (sort && !(sortFormatted === 'Rating' || sortFormatted === 'App')) {
    return res.status(400).send('You can only sort by rating or app')
  }
  if (genre) {
    genreFormatted = genre[0].toUpperCase() + genre.slice(1).toLowerCase();
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].find(genreKey => genreFormatted === genreKey)) {
      return res.status(400).send('Genres are limited to Action, Puzzle, Strategy, Casual, Arcade, Card');
    }
  }
  // MIDDLEWARE
  let results = playstore;
  if (sortFormatted) {
    results = playstore.sort((a, b) => {
      if (a[sortFormatted] < b[sortFormatted]) {
        return 1;
      } else if (a[sortFormatted] > b[sortFormatted]) {
        return -1;
      }
      return 0;
    })
  }
  if (genreFormatted) {
    results = results.filter(item => (item['Genres'].search(genreFormatted) !== -1))
  }
  res.json(results);
})

app.listen(8000, () => {
  console.log('listening on port 8000');
})