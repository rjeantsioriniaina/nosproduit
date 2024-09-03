// Script pour afficher une alerte lorsque l'utilisateur clique sur un bouton d'achat
document.querySelectorAll('.btn').forEach(function(button) {
    button.addEventListener('click', function() {
        alert("Vous allez être redirigé vers la page d'achat.");
    });
});

// Script pour le compte à rebours
function startCountdown(duration, display) {
    let timer = duration, minutes, seconds;
    setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration; // Optionnel: Réinitialiser le compte à rebours
        }
    }, 1000);
}

// Initialisation du compte à rebours lorsque la page est chargée
window.onload = function () {
    const countdownDuration = 60 * 30; // 30 minutes countdown
    const display = document.querySelector('#countdown-timer');
    if (display) {
        startCountdown(countdownDuration, display);
    }
};
