const request = require('supertest-as-promised');
const chai = require('chai');
const server = require('../index');

/* eslint prefer-destructuring: 0 */
const expect = chai.expect;
chai.config.includeStack = true;
const listId = '534613e9ef';
const htmlContent = '<p> <h2> This is testing template </h2> </p>';

/**
 * root level hooks
 */
describe('## Send email', () => {
  let campaignId = '';

  describe('# POST /api/mailchimp/batches', () => {
    it('should successfully send batch requests to mailchimp', (done) => {
      request(server)
        .post('/api/mailchimp/batches')
        .send({ operations: [{ method: 'POST', path: `lists/${listId}/members`, body: '{"email_address":"phpatel.4518@gmail.com","status":"subscribed","merge_fields":{"FNAME":"Pooja","LNAME":"Patel","COMPANY":"ABC Pvt. Ltd."}}' }] })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/mailchimp/campaigns', () => {
    it('should successfully create campaigns', (done) => {
      request(server)
        .post('/api/mailchimp/campaigns')
        .send({
          recipients: { list_id: listId },
          type: 'regular',
          settings: {
            subject_line: 'Hello There,',
            reply_to: 'phpatel.4518@gmail.com',
            from_name: 'Pooja Patel'
          }
        })
        .then((res) => {
          campaignId = res.body.id;
          expect(res.status).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        })
        .catch(done);
    });
  });

  describe(`# PUT /api/mailchimp/campaigns/${campaignId}/content`, () => {
    it('should successfully update campaigns with template', (done) => {
      request(server)
        .put(`/api/mailchimp/campaigns/${campaignId}/content`)
        .send({ html: htmlContent })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        })
        .catch(done);
    });
  });

  describe(`# POST /api/mailchimp/campaigns/${campaignId}/actions/send`, () => {
    it('should successfully send campaigns on scheduled time', (done) => {
      request(server)
        .post(`/api/mailchimp/campaigns/${campaignId}/actions/send`)
        // .send({ schedule_time: '2019-03-15T12:00:00Z' })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        })
        .catch(done);
    });
  });
});
