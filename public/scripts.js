const baseURL = 'http://localhost:3000';
let selectedCurrency = 'EUR';
let currencyRates = {};


async function getCategories() {
    try {
        const response = await fetch(`${baseURL}/categories`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const categories = await response.json();

        const categoryList = document.getElementById('categoryList');
        categoryList.innerHTML = ''; // Αδειάζει το UL πριν προσθέσει τα νέα στοιχεία

        categories.forEach(category => {
            const li = document.createElement('li');
            console.log(category._id)
            li.textContent = category.name;
            li.setAttribute('data-category-id', category._id); // Προσθέτει το attribute data-category-id
            li.addEventListener('click', () => {
                window.location.href = `category.html?id=${category._id}`;
            });
            categoryList.appendChild(li);
        });
    } catch (err) {
        //console.error('Error fetching categories:', err);
    }
}

async function getItemsByCategory(categoryId) {
    try {
        const response = await fetch(`${baseURL}/items/category/${categoryId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const items = await response.json();
       // console.log(items)
        const categoryItemsList = document.getElementById('categoryItems');
        categoryItemsList.innerHTML = ''; // Καθαρίζουμε το περιεχόμενο της λίστας αν υπάρχει ήδη

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.description} - ${item.price} ${item.currency}`;

            // Δημιουργία κουμπιού "Προσθήκη στο Καλάθι"
            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Προσθήκη στο Καλάθι';
            addToCartButton.addEventListener('click', () => {
                addToCart(item);
            });
            li.appendChild(addToCartButton);
            categoryItemsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching items for category:', error);
    }
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name} προστέθηκε στο καλάθι.`);
    console.log(cart);
}

function displayCartItems() {
    const cartItemsList = document.getElementById('cartItems');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsList.innerHTML = '';

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.description} - ${item.price} ${item.currency}`;

        // Δημιουργία κουμπιού "Αφαίρεση"
        const removeFromCartButton = document.createElement('button');
        removeFromCartButton.textContent = 'Αφαίρεση';
        removeFromCartButton.addEventListener('click', () => {
            removeFromCart(index);
        });

        li.appendChild(removeFromCartButton);
        cartItemsList.appendChild(li);
    });
}

// Function to remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Function to calculate total
function calculateTotal(cart) {
    return cart.reduce((total, item) => total + item.price, 0);
}

async function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Το καλάθι είναι άδειο.');
        return;
    }

    const items = cart.map(item => item._id);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const currency = 'EUR';
    const orderData = {
        items,
        total,
        currency,
        customerName: 'FANIS TSI',
        customerAddress: 'ATHENS,GREECE',
        customerPhone: '6999999999'
    };
    console.log("order data", orderData);
    try {
        const response = await fetch('/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const order = await response.json();
            console.log(order);
            alert('Η παραγγελία ολοκληρώθηκε.');
            localStorage.removeItem('cart');
            window.location.href = '/index.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error completing order:', error);
        alert('Σφάλμα κατά την ολοκλήρωση της παραγγελίας.');
    }
}

// fetchCurrencyRates to load the currency

//document.getElementById('currencyDropdown').addEventListener('change', (event) => {
//    selectedCurrency = event.target.value;
//    updatePricesWithSelectedCurrency();
//});

//api kanei metatropes mono apo eur
function updatePricesWithSelectedCurrency() {
    const categoryItemsList = document.getElementById('categoryItems');
    Array.from(categoryItemsList.children).forEach(li => {
        const itemText = li.textContent.split(' - ');
        const priceText = itemText[itemText.length - 1];
        const [eurPrice, currency] = priceText.split(' '); // Χρησιμοποιούμε destructuring για να αποθηκεύσουμε το ποσό και το νόμισμα σε ξεχωριστές μεταβλητές
        const eurPriceFloat = parseFloat(eurPrice);
        if (selectedCurrency !== "EUR"){
            li.textContent = `${itemText[0]} - ${itemText[1]} - ${convertPriceToCurrency(eurPriceFloat, selectedCurrency)}`;
        }else {
            li.textContent = `${itemText[0]} - ${itemText[1]} - ${convertPriceToEur(eurPrice, currency )}`;
        }

    });
}

async function fetchCurrencyRates() {
    try {
        const response = await fetch('https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_xTdpNAgsWp7cfLlyIShnzHC3n392XRq2TIJrXP2O&currencies=GBP%2CUSD%2CCHF%2CAUD&base_currency=EUR');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        currencyRates = data.data;
        console.log(currencyRates);
    } catch (error) {
        console.error('Error fetching currency rates:', error);
    }
}
//μονο οταν έχω rates να εκτελεστει
fetchCurrencyRates()
    .then(() => {
        // Παράδειγμα χρήσης της convertPriceToCurrency

    })
    .catch(error => {
        console.error('Error in fetchCurrencyRates or doSomethingAfterFetch:', error);
    });

function convertPriceToCurrency(price, currency) {
    if (currency === 'EUR') {
        return price.toFixed(2) + ' EUR'; // Εάν το νόμισμα είναι EUR, επιστρέφουμε απλά την τιμή σε EUR
    }
    //analoga me to ti thelei ο user

    let rate = 1;
    for (const cr in currencyRates) {
        if (currencyRates.hasOwnProperty(cr)) {
            if(currency === cr){
                rate = currencyRates[cr];
            }
        }
    }
    //console.log(currency);
    if (rate) {
        const convertedPrice = price * rate;
        return convertedPrice.toFixed(2) + ' ' + currency;
    } else {
        return 'Μη διαθέσιμος συντελεστής μετατροπής';
    }
}
//an einai euro thelw diairesh giati einai vs pros eyro
function convertPriceToEur(price, currency) {

    let rate = 1;
    for (const cr in currencyRates) {
        if (currencyRates.hasOwnProperty(cr)) {
            if(currency === cr){
                rate = currencyRates[cr];
            }
        }
    }
    //console.log(currency);
    if (rate) {
        const convertedPrice = price / rate;
        return convertedPrice.toFixed(2) + ' ' + "EUR";
    } else {
        return 'Μη διαθέσιμος συντελεστής μετατροπής';
    }
}

async function loginUser(event) {
    event.preventDefault();
    console.log('Form submitted');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username)

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        //TO FIX dont validate with username
        if (response.ok) {
            if (username === "admin"){
                window.location.href = '/merchantDashboard.html';
            }else {
                window.location.href = '/index.html';
            }

        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired'); // Προσθέστε αυτό το log
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    getCategories();

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');

    if (categoryId) {
        getItemsByCategory(categoryId);
    }

    displayCartItems();

    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }

    //if (window.location.pathname === '/orders.html') {
    //    getAllOrders();
    //}
});
