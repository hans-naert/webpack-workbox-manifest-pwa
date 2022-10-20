const express = require('express')
const webPush = require('web-push')
const app = express()
const port = 3000
let subscriptions = []

app.use(express.static('dist'))

app.use(express.json())

const vapidKeys = {
    publicKey:
        'BAbDV0c5ihoFwWyOr2np55aAgJcHrdMkZyWgymQXwPJepkS2PMde7inyUykAoo6A61vH14lOYAqDsOXEctd1CxU',
    privateKey: 'BteLLhowzTzZDfEuNXlFJ5iURKUzW2BAGAMi1JKVSlI'
};
webPush.setVapidDetails(
    'mailto:hans.naert@vives.be',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.post('/register', (req, res) => {
    console.log(JSON.stringify(req.body));
    if (!req.body || !req.body.endpoint) {
        // Invalid subscription.
        res.status(400);
        res.send('Invalid subscription');
        return false;
    }
    subscriptions.push(req.body)
    res.send("subscription registered")
    console.log('Subscription registered ' + req.body.endpoint);

})

app.post('/push', (req, res) => {
    subscriptions.forEach(subscription => {
        const notificationText = 'push notification from node';
        webPush.sendNotification(subscription, notificationText).then(() => {
            console.log('Notification sent');
        }).catch(function (error) {
            console.log('Error sending Notification' + error);
        });
    });
    res.send("pushed")
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})