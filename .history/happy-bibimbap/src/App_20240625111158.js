import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import AboutMe from './pages/AboutMe';
import ContactMe from './pages/ContactMe';
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/introduction" component={Introduction} />
        <Route path="/contactme" component={ContactMe} />
        <Route path="/aboutme" component={AboutMe} />
      </Switch>
    </Router>
  );
}

export default App;