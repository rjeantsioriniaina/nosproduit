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

// Fonction simple pour afficher un message de succès de chargement
function afficherMessage() {
    console.log("Script JS chargé et fonctionnel.");
}

// Appel de la fonction après le chargement de la page
window.addEventListener('DOMContentLoaded', (event) => {
    afficherMessage();
});

// Fonction pour rediriger automatiquement vers la page d'achat
function redirectToAffiliation(link) {
    window.location.href = link;
}

// Ajouter l'événement de clic aux liens avec la classe 'btn'
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        const affiliationLink = button.getAttribute('href');
        if (affiliationLink) {
            redirectToAffiliation(affiliationLink); // Redirection automatique
        } else {
            console.log("Lien d'affiliation manquant pour ce bouton !");
        }
    });
});

// Redirection automatique en fonction des boutons de filtre
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Empêche le comportement par défaut du bouton
        const category = button.getAttribute('data-category');
        
        // Redirection vers des pages spécifiques en fonction de la catégorie
        switch(category) {
            case "PROFESSIONELS":
                window.location.href = "page_professionels.html"; // Rediriger vers la page des professionnels
                break;
            case "SANTE-BEAUTE-NATURE":
                window.location.href = "page_sante_beaute.html"; // Rediriger vers la page santé et beauté
                break;
            case "MAISON":
                window.location.href = "page_maison.html"; // Rediriger vers la page maison
                break;
            case "INFORMATIQUE":
                window.location.href = "page_informatique.html"; // Rediriger vers la page informatique
                break;
            case "INTERNET":
                window.location.href = "page_internet.html"; // Rediriger vers la page internet
                break;
            case "ARGENT - TRAVAIL":
                window.location.href = "page_argent_travail.html"; // Rediriger vers la page argent-travail
                break;
            case "JEUX DIVERTISSEMENT":
                window.location.href = "page_jeux_divertissement.html"; // Rediriger vers la page jeux et divertissement
                break;
            case "CULTURE":
                window.location.href = "page_culture.html"; // Rediriger vers la page culture
                break;
            case "ACHAT SHOPPING":
                window.location.href = "page_achat_shopping.html"; // Rediriger vers la page achat-shopping
                break;
            default:
                window.location.href = "page_all.html"; // Par défaut, rediriger vers la page "Tous"
                break;
        }
    });
});

// Démarrer un compte à rebours si nécessaire
window.onload = function() {
    const countdownElement = document.querySelector('#countdown-timer');
    if (countdownElement) {
        // Démarre le compte à rebours de 30 minutes (1800 secondes)
        startCountdown(1800, countdownElement);
    }
};
