import mailchimpService from './services/mailchimp.service';

export const SAVE_CAMPAIGN_CONTENT = 'mailchimp/SAVE_CAMPAIGN_CONTENT';

const initialState = {
  campaignDetails: {
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

export const getLists = () => dispatch => mailchimpService.getLists();
export const addMembers = members => dispatch => mailchimpService.batchSubmit(members);

export const updateNewCampaign = payload => ({ type: SAVE_CAMPAIGN_CONTENT, payload });

const addMailChimpCampaign = body => mailchimpService.addMailChimpCampaign(body);
const updateCampaignContent = (id, body) => mailchimpService.updateCampaignContent(id, body);
const scheduleCampaign = (id, time) => mailchimpService.scheduleCampaign(id, time);

export const sendCampaign = () => (dispatch, getState) => {
  debugger;
  const {
    campaignDetails: {
      listDetails, template: { html }, scheduleDate, subjectLine
    }
  } = getState().mailchimp;
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
