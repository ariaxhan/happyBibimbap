import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Introduction from './pages/Introduction';
import ContactMe from './pages/ContactMe';
import AboutMe from './pages/AboutMe';

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