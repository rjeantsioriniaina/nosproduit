const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();

// Remplacez par votre clé API OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.use(bodyParser.json());

// Endpoint pour vérifier le Webhook de Facebook
app.get('/webhook', (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Endpoint pour gérer les messages de Facebook
app.post('/webhook', (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      if (webhook_event.message) {
        handleMessage(webhook_event.sender.id, webhook_event.message.text);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

async function handleMessage(sender_psid, received_message) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: received_message }]
    })
  });

  const data = await response.json();
  const botResponse = data.choices[0].message.content;

  callSendAPI(sender_psid, botResponse);
}

function callSendAPI(sender_psid, response) {
  const request_body = {
    recipient: { id: sender_psid },
    message: { text: response }
  };

  fetch(`https://graph.facebook.com/v12.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request_body)
  })
  .then(response => response.json())
  .then(data => console.log('message sent!'))
  .catch(error => console.error('Error:', error));
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
