import _ from 'lodash';
import mailchimpService from './services/mailchimp.service';

export const GET_LIST = 'mailchimp/GET_LIST';
export const SELECT_LIST = 'mailchimp/SELECT_LIST';
export const SAVE_CAMPAIGN_CONTENT = 'mailchimp/SAVE_CAMPAIGN_CONTENT';

const initialState = {
  campaignDetails: {
    lists: [],
    selectedList: {},
    listDetails: undefined,
    template: {
      html: undefined,
      htmlDesign: undefined,
    },
    scheduleDate: undefined,
    subjectLine: undefined,
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        lists: action.payload
      };

    case SELECT_LIST:
      return {
        ...state,
        selectedList: action.payload
      };

    case SAVE_CAMPAIGN_CONTENT:
      return {
        ...state,
        campaignDetails: {
          ...state.campaignDetails,
          ...action.payload
        }
      };

    default:
      return state;
  }
};

export const updateSelectedList = payload => ({ type: SELECT_LIST, payload });
export const getLists = () => dispatch => mailchimpService.getLists()
  .then(({ lists: response }) => {
    const lists = _.map(response, l => _.pick(l, ['id', 'name', 'campaign_defaults', 'stats.member_count']));
    dispatch({ type: GET_LIST, payload: lists });
    // dispatch(updateSelectedList(lists.length > 0 ? lists[0] : {}));
    return lists;
  })
  .catch((error) => {
    dispatch({ type: GET_LIST, payload: [] });
    // dispatch(updateSelectedList({}));
    return Promise.reject(error);
  });

export const addMembers = members => mailchimpService.batchSubmit(members);
export const updateNewCampaign = payload => ({ type: SAVE_CAMPAIGN_CONTENT, payload });

const addMailChimpCampaign = body => mailchimpService.addMailChimpCampaign(body);
const updateCampaignContent = (id, body) => mailchimpService.updateCampaignContent(id, body);
const scheduleCampaign = (id, time) => mailchimpService.scheduleCampaign(id, time);

export const sendCampaign = c => (dispatch, getState) => {
  const { html, scheduleDate, subjectLine } = c;
  const { selectedList: listDetails } = getState().mailchimp;
  // create campaign, update, send
  const body = {
    recipients: { list_id: listDetails.id },
    type: 'regular',
    settings: {
      subject_line: subjectLine || listDetails.campaign_defaults.subject || 'Hello There,',
      reply_to: listDetails.campaign_defaults.from_email,
      from_name: listDetails.campaign_defaults.from_name
    }
  };
  return addMailChimpCampaign(body)
    .then(({ id }) => updateCampaignContent(id, { html })
      .then(() => scheduleCampaign(id, scheduleDate)
        .then(() => {
          const { campaignDetails: payload } = initialState;
          dispatch({ type: SAVE_CAMPAIGN_CONTENT, payload });
          return Promise.resolve('Scheduled Successfully!!!');
        })))
    .catch(error => Promise.reject({ error, errorMessage: 'Error scheduling campaign, Please try again.' }));
};
