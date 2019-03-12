import axios from 'axios';

export function batchSubmit(body) {
  return axios.post('/api/mailchimp/batches', { operations: body })
    .then(({ data }) => Promise.resolve(data))
    .catch(error => Promise.reject(error));
}

export function addMailChimpCampaign(body) {
  return axios.post('/api/mailchimp/campaigns', body)
    .then(({ data }) => Promise.resolve(data))
    .catch(error => Promise.reject(error));
}

export function updateCampaignContent(id, body) {
  return axios.put(`/api/mailchimp/campaigns/${id}/content`, body)
    .then(({ data }) => Promise.resolve(data))
    .catch(error => Promise.reject(error));
}

export function sendCampaign(id) {
  return axios.post(`/api/mailchimp/campaigns/${id}/actions/send`)
    .then(({ data }) => Promise.resolve(data))
    .catch(error => Promise.reject(error));
}

export function scheduleCampaign(id, time) {
  return axios.post(`/api/mailchimp/campaigns/${id}/actions/schedule`, { schedule_time: time })
    .then(({ data }) => Promise.resolve(data))
    .catch(error => Promise.reject(error));
}

export function getLists() {
  return axios.get('/api/mailchimp/lists')
    .then(({ data }) => Promise.resolve(data))
    .catch(error => Promise.reject(error));
}

export default {
  batchSubmit, addMailChimpCampaign, updateCampaignContent, sendCampaign, scheduleCampaign, getLists
};
