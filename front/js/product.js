// Récupérer l'id de l'URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fonction pour limiter la chaîne à 200 caractères
function limitDescription(description) {
    if (description.length > 200) {
        return description.substring(0, 200) + '...';
    }
    return description;
}


// Faire un fetch sur l'URL correspondante en envoyant l'id
async function fetchData() {
    const apiUrl = `http://localhost:3000/api/products/${productId}`;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();

            // Limiter la description à 200 caractères
            const limitedDescription = limitDescription(data.description);

            // Mettre à jour les éléments sur la page avec les données récupérées
            document.querySelector('figure img').src = data.image;
            document.querySelector('.button-buy').setAttribute('data-id', data._id);
            document.querySelector('h1').innerText = data.titre;
            document.querySelector('p').innerText = limitedDescription;
            document.querySelector('.showprice').textContent = `${data.declinaisons[0].prix}€`;
            document.querySelector('.button-buy').textContent = `Buy ${data.shorttitle}`


            // Ajouter les options de format (à adapter selon votre modèle de données)
            const formatSelect = document.getElementById('format');
            data.declinaisons.forEach((format, index) => {
                const option = document.createElement('option')
                option.value = format.taille
                option.setAttribute('data-id', index)
                option.textContent = format.taille
                formatSelect.appendChild(option)
            });

            //au changement de format, on change le prix en recupérant le prix du format selectionné
            formatSelect.addEventListener('change', () => {
                const selectedFormat = formatSelect.value;
                const selectedFormatData = data.declinaisons.find(format => format.taille === selectedFormat);
                document.querySelector('.showprice').textContent = `${selectedFormatData.prix}€`;
            });






            // Mettre à jour la description complète dans la balise <aside>
            document.querySelector('aside h2').innerText = `Description de l’oeuvre : ${data.titre}`;
            document.querySelector('aside p').innerText = data.description;

            // Gérer l'événement du bouton "Buy bird"
            const buyButton = document.querySelector('.button-buy');
            buyButton.addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('quantity').value, 10);
                const selectedFormat = formatSelect.value;

                showModal(`Vous avez ajouté ${quantity} ${data.shorttitle} au panier !`);

                numberItem();








    // Récupérer les commandes actuelles du localStorage ou initialiser un tableau vide
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Vérifier si une commande identique existe déjà dans le localStorage
    const existingOrder = orders.find(order => order.productId === data._id && order.format === selectedFormat);

    if (existingOrder) {
        // Si une commande identique existe, incrémenter la quantité
        existingOrder.quantity += quantity;
    } else {
        const formatSelect = document.getElementById('format');
        // Sinon, ajouter une nouvelle commande à la liste des commandes
        const newOrder = {
            productId: data._id,
            quantity: quantity,
            format: formatSelect.value
        };
        orders.push(newOrder);
    }

    // Mettre à jour le localStorage avec les nouvelles commandes
    localStorage.setItem('orders', JSON.stringify(orders));

    numberItem();



    
            });
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        // Gérer les erreurs de requête
        console.error('Erreur lors de la récupération des données:', error);
    }
}

// Appeler la fonction pour récupérer et afficher les données au chargement de la page
document.addEventListener('DOMContentLoaded', fetchData);



