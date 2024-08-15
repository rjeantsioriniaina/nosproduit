require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();

// Variables d'environnement
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Endpoint pour vérifier le Webhook de Facebook
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403); // Forbidden
    }
  } else {
    res.sendStatus(400); // Bad Request
  }
});

// Endpoint pour gérer les messages de Facebook
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(async (entry) => {
      const webhook_event = entry.messaging[0];
      console.log(webhook_event);

      if (webhook_event.message) {
        await handleMessage(webhook_event.sender.id, webhook_event.message.text);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404); // Not Found
  }
});

// Fonction pour gérer les messages et interagir avec OpenAI
async function handleMessage(sender_psid, received_message) {
  try {
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

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    await callSendAPI(sender_psid, botResponse);
  } catch (error) {
    console.error('Error in handleMessage:', error);
  }
}

// Fonction pour envoyer des messages à l'utilisateur via Facebook Messenger
async function callSendAPI(sender_psid, response) {
  const request_body = {
    recipient: {
      id: sender_psid
    },
    message: {
      text: response
    }
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v16.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_body)
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Failed to send message:', data);
      throw new Error('Failed to send message');
    }

    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Fonction pour configurer le bouton "Get Started" et le menu persistant
async function configureFacebookMessenger() {
  try {
    // Configurer le bouton "Get Started"
    const getStartedPayload = {
      get_started: {
        payload: "GET_STARTED"
      }
    };

    const resGetStarted = await fetch(`https://graph.facebook.com/v16.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(getStartedPayload)
    });

    const getStartedData = await resGetStarted.json();
    if (!resGetStarted.ok) {
      console.error('Failed to configure Get Started button:', getStartedData);
      throw new Error('Failed to configure Get Started button');
    }

    console.log('Get Started button configured successfully');

    // Configurer le menu persistant
    const persistentMenuPayload = {
      persistent_menu: [
        {
          locale: "default",
          composer_input_disabled: false,
          call_to_actions: [
            {
              title: "Help",
              type: "postback",
              payload: "HELP_PAYLOAD"
            },
            {
              title: "Contact Us",
              type: "postback",
              payload: "CONTACT_PAYLOAD"
            }
          ]
        }
      ]
    };

    const resMenu = await fetch(`https://graph.facebook.com/v16.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(persistentMenuPayload)
    });

    const menuData = await resMenu.json();
    if (!resMenu.ok) {
      console.error('Failed to configure menu:', menuData);
      throw new Error('Failed to configure menu');
    }

    console.log('Facebook Messenger configuration successful');
  } catch (error) {
    console.error('Error configuring Facebook Messenger:', error);
  }
}

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log('Your app is listening on port ' + PORT);

  try {
    await configureFacebookMessenger();
  } catch (error) {
    console.error('Error during server startup:', error);
  }
});
