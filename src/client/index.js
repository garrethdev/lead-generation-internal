import React from 'react';
import { render } from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store, { history } from './store';
import App from './containers/app';
import 'bootstrap/dist/css/bootstrap.min.css';

const target = document.querySelector('#root');

render(
  <Provider store={store} ReactReduxContext={ReactReduxContext}>
    <ConnectedRouter history={history} ReactReduxContext={ReactReduxContext}>
      <App />
    </ConnectedRouter>
  </Provider>,
  target
);
