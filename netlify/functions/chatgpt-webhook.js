// netlify/functions/chatgpt-webhook.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { body, httpMethod, queryStringParameters } = event;

  if (httpMethod === 'POST') {
    const data = JSON.parse(body);

    // Process incoming messages from Facebook
    if (data.object === 'page') {
      const entry = data.entry[0];
      const messaging = entry.messaging[0];
      const senderId = messaging.sender.id;
      const messageText = messaging.message.text;

      // Call ChatGPT API
      const chatGptResponse = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: messageText,
          max_tokens: 150
        })
      });
      const chatGptData = await chatGptResponse.json();
      const chatGptReply = chatGptData.choices[0].text.trim();

      // Send response back to Facebook
      await fetch(`https://graph.facebook.com/v12.0/me/messages?access_token=YOUR_PAGE_ACCESS_TOKEN`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: chatGptReply }
        })
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'ok' }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method Not Allowed' }),
  };
};
