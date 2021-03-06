import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import auth from './auth';
import mailchimp from './mailChimp';

export default history => combineReducers({
  router: connectRouter(history),
  auth,
  mailchimp
});
