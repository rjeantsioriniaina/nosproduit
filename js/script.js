// Vérification du support Service Worker par le navigateur
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('js/sw.js').then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
    });
} else {
    console.log("Service Worker non supporté par le navigateur.");
}

// Exemple d'une fonction simple
function afficherMessage() {
    console.log("Script JS chargé et fonctionnel.");
}

// Appel de la fonction après le chargement de la page
window.addEventListener('DOMContentLoaded', (event) => {
    afficherMessage();
});

// Fonction pour démarrer le compte à rebours
function startCountdown(duration, display) {
    let timer = duration, minutes, seconds;
    setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        // Ajoute un zéro devant les minutes et les secondes si nécessaire
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Affiche le temps sous format MM:SS
        display.textContent = minutes + ":" + seconds;

        // Réinitialise le compteur lorsque le temps est écoulé
        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

// Ajoute un événement de clic à tous les boutons avec la classe 'btn'
document.querySelectorAll(".btn").forEach(function(button) {
    button.addEventListener("click", function() {
        alert("Vous allez être redirigé vers la page d'achat.");
    });
});

// Démarre le compte à rebours lorsque la fenêtre est complètement chargée
window.onload = function() {
    const countdownElement = document.querySelector("#countdown-timer");
    if (countdownElement) {
        // Démarre le compte à rebours de 30 minutes (1800 secondes)
        startCountdown(1800, countdownElement);
    }
};

// Script de redirection automatique avec lien d'affiliation spécifique
        function redirectToAffiliation(affiliationLink) {
            window.location.href = affiliationLink;
        }


        // Ajoutez cet événement au clic des boutons "Acheter maintenant"
        const buyButtons = document.querySelectorAll('.btn');
        buyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const affiliationLink = button.getAttribute('data-affiliation');
                redirectToAffiliation(affiliationLink);
            });
        });
    </script>
</body>
</html>
