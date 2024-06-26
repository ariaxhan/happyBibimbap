import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import AboutMe from './components/AboutMe';
import ContactMe from './components/ContactMe';
import Home from './components/Home';
import Introduction from './components/Introduction';
import Portfolio from './components/Portfolio';

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