import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

registerServiceWorker().then(sw => {
  ReactDOM.render(<App sw={sw} />, document.getElementById('root'));
})
