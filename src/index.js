import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import App from './components/app/App';
import { Operation, reducer } from './reducer/reducer';

const store = createStore(
  reducer,
  applyMiddleware(thunk),
);

store.dispatch(Operation.getFlightsData());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
