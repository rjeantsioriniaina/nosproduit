const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Variables d'environnement
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Vérification du webhook
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Réception des messages
app.post("/webhook", async (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(async (entry) => {
      let event = entry.messaging[0];
      let senderId = event.sender.id;
      if (event.message && event.message.text) {
        let messageText = event.message.text;

        // Envoyer le message à l'API ChatGPT
        let responseText = await getChatGPTResponse(messageText);

        // Envoyer la réponse à l'utilisateur
        sendMessage(senderId, responseText);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// Fonction pour obtenir la réponse de ChatGPT
async function getChatGPTResponse(message) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );
  return response.data.choices[0].message.content;
}

// Fonction pour envoyer un message via l'API Facebook
function sendMessage(senderId, responseText) {
  const requestBody = {
    recipient: {
      id: senderId,
    },
    message: {
      text: responseText,
    },
  };

  axios
    .post(
      `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      requestBody
    )
    .then(() => {
      console.log("Message sent!");
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Utiliser require pour axios
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Route pour la vérification du webhook de Facebook
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Route pour recevoir les messages de Facebook
app.post('/webhook', async (req, res) => {
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(async (entry) => {
      const messagingEvents = entry.messaging;

      for (let i = 0; i < messagingEvents.length; i++) {
        const event = messagingEvents[i];
        if (event.message && event.message.text) {
          const senderId = event.sender.id;
          const messageText = event.message.text;

          // Appel à l'API ChatGPT
          try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: messageText }]
            }, {
              headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
              }
            });

            const replyText = response.data.choices[0].message.content;

            // Envoi de la réponse à Facebook Messenger
            await axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${pageAccessToken}`, {
              recipient: { id: senderId },
              message: { text: replyText }
            });
          } catch (error) {
            console.error('Error handling message:', error);
          }
        }
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
