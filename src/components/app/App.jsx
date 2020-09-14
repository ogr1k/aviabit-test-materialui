import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from '../main/main'
import PeriodInformation from '../period-information/period-information';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <Main />
      </Route>
      <Route exact path="/information/:year/:month?" component={PeriodInformation} />
    </Switch>
  </BrowserRouter>
)

export default App;
