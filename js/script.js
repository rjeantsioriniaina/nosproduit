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
                    timer = duration;
                }
            }, 1000);
        }

        window.onload = function () {
            const countdownDuration = 60 * 30; // 30 minutes countdown
            const display = document.querySelector('#countdown-timer');
            startCountdown(countdownDuration, display);
        };

<script>
    document.getElementById('newsletterForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                window.location.href = 'merci.html';
            } else {
                alert('Erreur lors de la soumission du formulaire.');
            }
        }).catch(error => {
            alert('Erreur de connexion. Veuillez réessayer.');
        });
    });
</script>
