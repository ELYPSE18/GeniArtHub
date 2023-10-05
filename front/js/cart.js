// Récupérer les commandes du localStorage
const orders = JSON.parse(localStorage.getItem('orders')) || [];

// Sélectionner l'élément du panier
const cartElement = document.getElementById('cart');

// Fonction pour récupérer les détails des produits depuis l'API
async function fetchProductDetails(productId) {
    const apiUrl = `http://localhost:3000/api/products/${productId}`;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const productData = await response.json();
            return productData;
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données du produit:', error);
    }
}

// Afficher les éléments du panier sur la page avec les détails récupérés depuis l'API
async function displayCartItems() {
    for (const order of orders) {
        const productData = await fetchProductDetails(order.productId);
        const selectedDeclinaison = productData.declinaisons.find(format => format.taille === order.format);
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${productData.image}" alt="${productData.titre}">
            <p>${productData.titre}</p>
            <p>Quantité: ${order.quantity}</p>
            <p>Format: ${selectedDeclinaison.taille}</p>
            <p>Prix unitaire: ${selectedDeclinaison.prix}€</p>
            <p>Total: ${order.quantity * selectedDeclinaison.prix}€</p>
            <a href="#">Supprimer</a>
        `;

        //fonction pour supprimer un produit du panier
        const deleteButton = productItem.querySelector('a');
        deleteButton.addEventListener('click', () => {
            // Récupérer l'index de l'élément à supprimer dans le tableau orders
            const index = orders.findIndex(order => order.productId === productData._id && order.format === selectedDeclinaison.taille);
            // Supprimer l'élément du tableau orders
            orders.splice(index, 1);
            // Mettre à jour le localStorage
            localStorage.setItem('orders', JSON.stringify(orders));
            // Supprimer l'élément du DOM
            productItem.remove();
        });

        
        cartElement.appendChild(productItem);
    }
}

// Appeler la fonction pour afficher les éléments du panier au chargement de la page
document.addEventListener('DOMContentLoaded', displayCartItems);
