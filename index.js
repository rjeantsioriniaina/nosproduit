​
    const dataMenu = await resMenu.json();


    if (!resMenu.ok) {
      console.error('Failed to configure persistent menu:', dataMenu); // Log de l'erreur lors de la configuration du menu persistant
      throw new Error('Failed to configure persistent menu');
    }
​
    console.log('Persistent menu configured successfully'); // Log de la réussite de la configuration du menu persistant


  } catch (error) {
    console.error('Error configuring Facebook Messenger:', error); // Log de l'erreur lors de la configuration de Messenger
  }
}
​
// Configurer le bouton "Get Started" et le menu persistant lors du démarrage du serveur
configureFacebookMessenger();
​
// Démarrer le serveur sur le port 3000
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
