const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Vérification du Webhook
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Gestion des messages
app.post('/webhook', async (req, res) => {
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
                        await axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`, {
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
