import React from 'react';
import {
  BrowserRouter as Router, 
  Route, 
  Switch,
} from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';

function App() {
  return (
    <div>
      <Router>
          <Switch>
              <Route 
                  path="/" 
                  exact
                  render={(routerProps) => <HomePage {...routerProps} />} 
              />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
