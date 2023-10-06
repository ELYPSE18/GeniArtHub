/*  récuperer le cart dans le local storage
    si il y a des elements enregistrées dedans,
    récupréer la quantité et l'afficher dans un span qu'il faut inserer dans #carticon
*/

const span = '<span>0</span>'
const cartIcon = document.querySelector("#carticon");
cartIcon.insertAdjacentHTML("beforeend", span);

function numberItem() {
const cart = JSON.parse(localStorage.getItem('orders')) || [];
const cartIcon = document.querySelector("#carticon");
if (cart.length > 0) {
    const quantite = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.querySelector("#carticon span").textContent = quantite;
}
}

numberItem();




