

//récupérer le panier du localStorage
const panier = JSON.parse(localStorage.getItem('orders')) || [];

//si le panier est vide, afficher un message
if (panier.length === 0) {
    document.querySelector('#panier').innerText = 'Votre panier est vide, veuillez ajouter un article';
}

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
    for (let order of orders) {
        const productData = await fetchProductDetails(order.productId);
        const selectedDeclinaison = productData.declinaisons.find(format => format.taille === order.format);
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${productData.image}" alt="${productData.titre}">
            <p>${productData.titre}</p>
            <p>Format: ${selectedDeclinaison.taille}</p>
            <p>Prix unitaire: ${selectedDeclinaison.prix}€</p>
            quantité : 
            <input type="number" value="${order.quantity}" min="1">
            <p class="total-price">Total: ${order.quantity * selectedDeclinaison.prix.toFixed(2)}€</p>
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

        //modifier la quantité d'un produit dans le panier
        const quantityInput = productItem.querySelector('input');
        quantityInput.addEventListener('change', () => {
            // Récupérer la nouvelle quantité
            const newQuantity = parseInt(quantityInput.value, 10);
            // Mettre à jour la quantité dans le tableau orders
            order.quantity = newQuantity;
            // Mettre à jour le localStorage
            localStorage.setItem('orders', JSON.stringify(orders));
            // Mettre à jour le prix total de l'article individuel
            const totalPriceElement = productItem.querySelector('.total-price');
            totalPriceElement.textContent = `Total: ${order.quantity * selectedDeclinaison.prix.toFixed(2)}€`;

            // Mettre à jour le prix total du panier global
            updatePrice();
        });

        cartElement.appendChild(productItem);
    }
}

async function updatePrice() {
    let totalPrice = 0;
    let totalArticles = 0;

    const promises = orders.map(async (order) => {
        try {
            const productData = await fetchProductDetails(order.productId);
            const selectedDeclinaison = productData.declinaisons.find(format => format.taille === order.format);
            const productPrice = order.quantity * selectedDeclinaison.prix;
            totalPrice += productPrice;
            totalArticles += order.quantity;

            const productItem = document.querySelector(`.product-item[data-product-id="${order.productId}"][data-format="${selectedDeclinaison.taille}"]`);
            if (productItem) {
                const totalPriceElement = productItem.querySelector('.total-price');
                totalPriceElement.textContent = `Total: ${productPrice.toFixed(2)}€`;
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du prix du produit:', error);
        }
    });

    await Promise.all(promises);

    const totalArticlesElement = document.getElementById('total-articles');
    totalArticlesElement.textContent = totalArticles;

    const totalAmountElement = document.getElementById('total-amount');
    totalAmountElement.textContent = `${totalPrice.toFixed(2)}€`;
}

// Confirmation de commande après validation du formulaire avec un message de confirmation et un numéro de commande
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const contact = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            email: document.getElementById('email').value,
        };
        const products = orders.map(order => order.productId);
        const body = {
            contact,
            products
        };

        const response = await fetch('http://localhost:3000/api/products/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.removeItem('orders');
            document.querySelector('.productlist').innerHTML = '';
            // Afficher la modal avec le numéro de commande
            const modal = document.getElementById('modal');
            const orderNumber = document.getElementById('order-number');
            document.querySelector('.cart-summary').innerHTML = '';
            orderNumber.textContent = data.orderId;
            modal.style.display = 'block';
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
        // Gérer l'affichage d'un message d'erreur à l'utilisateur si nécessaire
    }
});

// Fermer la modal lorsque l'utilisateur clique en dehors de celle-ci
const modal = document.getElementById('modal');
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});



// Appeler la fonction pour afficher les éléments du panier au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    updatePrice();
});

numberItem();



