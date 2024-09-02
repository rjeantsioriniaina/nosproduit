// Exemple simple de script pour afficher une alerte lorsque l'utilisateur clique sur un bouton d'achat
document.querySelectorAll('.btn').forEach(function(button) {
    button.addEventListener('click', function() {
        alert("Vous allez être redirigé vers la page d'achat.");
    });
});
