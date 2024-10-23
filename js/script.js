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

// Script pour le filtrage des produits
const filterButtons = document.querySelectorAll('.filter-btn');  // Déclaré une seule fois
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

// JavaScript pour redirection après soumission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('emailForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                if (response.ok) {
                    window.location.href = '/nosproduit/inscrivez-vous-newsletter.html';
                } else {
                    alert('Erreur lors de la soumission du formulaire.');
                }
            }).catch(function(error) {
                alert('Erreur lors de la soumission du formulaire.');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    function toggleMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (menu) {
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
            }
        } else {
            console.error('Élément avec ID ' + menuId + ' non trouvé.');
        }
    }

    // Exemple d'appel de la fonction toggleMenu
    toggleMenu('sante-beaute-nature'); // Remplacez 'sante-beaute-nature' par l'ID de votre menu
    toggleMenu('argent-travail'); // Remplacez 'argent-travail' par l'ID de votre menu

    // Assurez-vous que tous les éléments que vous souhaitez manipuler existent
    const element = document.getElementById('elementCible');
    if (element) {
        element.textContent = "Le contenu a été mis à jour.";
    } else {
        console.error('Élément "elementCible" non trouvé.');
    }
});
