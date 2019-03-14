const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');
const server = require('../index');

/* eslint prefer-destructuring: 0 */
const expect = chai.expect;
chai.config.includeStack = true;

/**
 * root level hooks
 */
describe('## Misc', () => {
  describe('# GET /health-check', () => {
    it('should return OK', (done) => {
      request(server)
        .get('/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
});
