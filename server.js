// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Initialisation du cache (optionnel)
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Configuration de bodyParser pour parser les requêtes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de Hugging Face Inference
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Route principale pour gérer les requêtes de Facebook Messenger
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;

        // Vérification que le webhook est un événement provenant de Facebook
        if (body.object === 'page') {
            body.entry.forEach(async function(entry) {
                const webhookEvent = entry.messaging[0];
                const senderId = webhookEvent.sender.id;

                if (webhookEvent.message) {
                    const messageText = webhookEvent.message.text;

                    // Vérifie si la réponse est en cache
                    const cachedResponse = cache.get(messageText);
                    if (cachedResponse) {
                        await sendMessage(senderId, cachedResponse);
                    } else {
                        // Appel à l'API Hugging Face pour traiter le texte
                        const hfResponse = await hf.textGeneration({
                            model: "gpt2",
                            inputs: messageText,
                        });

                        const botResponse = hfResponse.generated_text;

                        // Mise en cache de la réponse
                        cache.set(messageText, botResponse);

                        // Envoi de la réponse à l'utilisateur
                        await sendMessage(senderId, botResponse);
                    }
                }
            });

            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.sendStatus(500);
    }
});

// Fonction pour envoyer un message via l'API Facebook Messenger
async function sendMessage(senderId, text) {
    const url = `https://graph.facebook.com/v10.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messaging_type: 'RESPONSE',
            recipient: { id: senderId },
            message: { text: text },
        }),
    });

    if (!response.ok) {
        console.error('Failed to send message:', await response.text());
    }
}

// Route pour la vérification du webhook (lors de la configuration de l'application Facebook)
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
