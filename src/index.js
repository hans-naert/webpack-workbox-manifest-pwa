import _ from 'lodash';
import './style.css';
import Icon from './icon.png';
import printMe from './print.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { LikeButton } from './like_button.js';
import { Workbox } from 'workbox-window';

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');

  wb.register();
}

//add onclick for request notifications
let notificationsBtn = document.getElementById('notificationsBtn');
if (!('Notification' in window)) {
  // this browser does not support notifications
} else if (Notification.permission === 'denied') {
  // the user denied notification permission!
} else if (Notification.permission === 'granted') {
  // setup UI to show notifications already enabled
  notificationsBtn.style.display = 'none';
}
notificationsBtn.addEventListener('click', () => {
  Notification.requestPermission().then((permission) => {
    console.log(permission);
    if(permission=="granted")
      notificationsBtn.style.display = 'none';
  });
});

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

let applicationServerPublicKey = "BAbDV0c5ihoFwWyOr2np55aAgJcHrdMkZyWgymQXwPJepkS2PMde7inyUykAoo6A61vH14lOYAqDsOXEctd1CxU";
let isSubscribed = false;
(function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  navigator.serviceWorker.getRegistration().then((registration) => registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  }))
    .then(function (subscription) {
      console.log('User is subscribed. subscription:' + JSON.stringify(subscription));
      fetch("/register", {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(subscription) // data can be `string` or {object}!
      }).then(res => res.text())
        .then(response => console.log('Success:', response))
        .catch(error => console.error('Error registering:', error));
      isSubscribed = true;
    })
    .catch(function (err) {
      console.log('Failed to subscribe the user: ', err);
    });
})();

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

navigator.serviceWorker.addEventListener('message', (event) => {
  console.log(event.data);
});

window.setInterval(() => { navigator.serviceWorker.ready.then(worker => worker.active.postMessage("Hi from page")) }, 5000);

document.body.appendChild(component());

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(LikeButton));

let pushNotificationTriggerButton = document.getElementById('pushNotificationTriggerBtn');
pushNotificationTriggerButton.onclick = () => {
  fetch("/push", {
    method: 'POST', // or 'PUT'
    body: JSON.stringify("test") // data can be `string` or {object}!
  }).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
  //.catch(error => console.error('Error:', error));
};