import React from 'react';
import {AppRegistry} from 'react-native';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

import AppReducer from './src/reducers';
import AppNavigator from './src/navigations/AppNavigation';

const store = createStore(AppReducer, applyMiddleware(thunk));

console.disableYellowBox = true;

function StarterApp() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

AppRegistry.registerComponent('betfree', () => StarterApp);

export default StarterApp;
