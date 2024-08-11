async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  if (userInput.trim() === "") return;

  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
  
  // Clear input field
  document.getElementById('user-input').value = '';

  // Send the message to the OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Utilisation de la variable d'environnement
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userInput }]
    })
  });

  const data = await response.json();
  const botResponse = data.choices[0].message.content;
  
  chatbox.innerHTML += `<p><strong>Bot:</strong> ${botResponse}</p>`;
}
