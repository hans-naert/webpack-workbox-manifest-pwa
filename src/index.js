import _ from 'lodash';
import './style.css';
import Icon from './icon.png';
import printMe from './print.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {LikeButton} from './like_button.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

function component() {
    const element = document.createElement('div');
  
    // Lodash, now imported in this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);

    const btn = document.createElement('button');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);
  
    return element;
  }
  
  document.body.appendChild(component());

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(LikeButton));