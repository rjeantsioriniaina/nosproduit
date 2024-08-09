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
    })
    .catch((error) => {
      console.error("Unable to send message:", error);
    });
}

// Lancer le serveur
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
