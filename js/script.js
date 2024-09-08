<script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
        });
    }
</script>

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
