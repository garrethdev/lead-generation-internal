import { push } from 'react-router-redux';
import _ from 'lodash';
import mailchimpService from './services/mailchimp.service';

export const SAVE_CAMPAIGN_CONTENT = 'mailchimp/SAVE_CAMPAIGN_CONTENT';
export const GET_LIST_DETAILS = 'mailchimp/GET_LIST_DETAILS';

const initialState = {
  htmlContent: null,
  listDetails: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CAMPAIGN_CONTENT:
      return {
        ...state,
        htmlContent: action.payload
      };

    case GET_LIST_DETAILS:
      return {
        ...state,
        listDetails: action.payload
      };

    default:
      return state;
  }
};

export const addMembers = members => dispatch => mailchimpService.batchSubmit(members);
export const addMailChimpCampaign = body => dispatch => mailchimpService.addMailChimpCampaign(body);
export const updateCampaignContent = (id, body) => dispatch => mailchimpService.updateCampaignContent(id, body);
export const sendCampaign = id => dispatch => mailchimpService.sendCampaign(id);
export const scheduleCampaign = (id, time) => dispatch => mailchimpService.scheduleCampaign(id, time);
export const getLists = () => dispatch => mailchimpService.getLists();
export const getListDetails = id => dispatch => mailchimpService.getListDetails(id)
  .then(({ details = {} }) => {
    const listDetails = _.pick(details, ['id', 'name', 'contact', 'stats.member_count']);
    dispatch({
      type: GET_LIST_DETAILS,
      payload: listDetails
    });
    return listDetails;
  });

export const saveCampaignContent = content => (dispatch) => {
  dispatch(push('/addCampaignDetails'));
  dispatch({
    type: SAVE_CAMPAIGN_CONTENT,
    payload: content
  });
};
