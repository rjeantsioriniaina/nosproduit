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

 </script>
    
 <script>
        // Script pour le filtrage des produits
        const filterButtons = document.querySelectorAll('.filter-btn');
        const products = document.querySelectorAll('.product');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                
                products.forEach(product => {
                    if (category === 'all' || product.getAttribute('data-category') === category) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
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
