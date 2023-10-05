// faire appel a l'api et peupler la page



const apiUrl = 'http://localhost:3000/api/products/';

async function fetchData() {
    try {
        const response = await fetch(apiUrl); // Faire la requête HTTP GET avec fetch
        if (response.ok) {
            const data = await response.json(); // Parse la réponse JSON
            data.forEach(el => {
                const article = `<article>
                                    <img src="${el.image}" alt="${el.titre}">
                                    <a href="product.html?id=${el._id}">Buy ${el.shorttitle}</a>
                                </article> `;
                document.querySelector('.products').innerHTML += article;
                
            });
            // console.log(data); // Faire quelque chose avec les données JSON récupérées
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        // Gérer les erreurs de requête
        console.error('Erreur lors de la récupération des données:', error);
    }
}

// Appeler la fonction pour récupérer les données au chargement de la page ou à un événement
fetchData();





