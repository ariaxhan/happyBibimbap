import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Portfolio from './components/Portfolio';
import Introduction from './components/Introduction';
import ContactMe from './components/ContactMe';
import AboutMe from './components/AboutMe';

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