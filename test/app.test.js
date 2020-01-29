const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
  it('should receive a 200 code if successful', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
  })
  it('should receive a 400 code if given bad sort', () => {
    return supertest(app)
      .get('/apps')
      .query({ "sort": "garbage" })
      .expect(400)
  })
  it('should receive a 400 code if given bad filter (genre)', () => {
    return supertest(app)
      .get('/apps')
      .query({ "genre": "garbage" })
      .expect(400)
  })
  it('should receive an array of app objects', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1)
      })
  })
  it('should have object keys in the returned array', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const app = res.body[0]
        expect(app).to.include.all.keys(
          'App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Installs', 'Type',
          'Price', 'Content Rating', 'Genres', 'Last Updated', 'Current Ver', 'Android Ver'
        )
      })
  })
  it('should return results sorted by app name', () => {
    return supertest(app)
      .get('/apps')
      .query({ "sort": "App" })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.App < appAtI.App) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      })
  })
  it('should return results sorted by rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ "sort": "Rating" })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const ratingAtI = res.body[i];
          const ratingAtIPlus1 = res.body[i + 1];
          if (ratingAtIPlus1.Rating > ratingAtI.Rating) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      })
  })
  it('should return results filtered by acceptable genre', () => {
    return supertest(app)
      .get('/apps')
      .query({ "genre": "Casual" })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let filtered = true;
        let i = 0;
        while (i < res.body.length) {
          const genre = res.body[i].Genres;
          if (genre.indexOf('Casual') === -1 ) {
            filtered = false;
            break;
          }
          i++;
        }
        expect(filtered).to.be.true;
      })
  })
})