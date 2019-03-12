import { push } from 'react-router-redux';
import _ from 'lodash';
import mailchimpService from './services/mailchimp.service';

export const SAVE_CAMPAIGN_CONTENT = 'mailchimp/SAVE_CAMPAIGN_CONTENT';
export const GET_LISTS = 'mailchimp/GET_LISTS';

const initialState = {
  htmlContent: null,
  lists: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CAMPAIGN_CONTENT:
      return {
        ...state,
        htmlContent: action.payload
      };

    case GET_LISTS:
      return {
        ...state,
        lists: action.payload
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
export const getLists = () => dispatch => mailchimpService.getLists()
  .then(({ lists = [] }) => {
    const reducedLists = _.map(lists, e => _.pick(e, ['id', 'name', 'stats.member_count']));
    dispatch({
      type: GET_LISTS,
      payload: reducedLists
    });
    return reducedLists;
  });

export const saveCampaignContent = content => (dispatch) => {
  dispatch(push('/addCampaignDetails'));
  dispatch({
    type: SAVE_CAMPAIGN_CONTENT,
    payload: content
  });
};
