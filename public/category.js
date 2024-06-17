let selectedCurrency = 'EUR';
let currencyRates = {};

document.getElementById('shopTitle').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// cart Button
document.getElementById('viewCartButton').addEventListener('click', () => {
    checkLoginStatus().then(data => {
        window.location.href = 'cart.html';
    }).catch(error => {
        window.location.href = 'login.html';
    });
});

document.getElementById('loginButton').addEventListener('click', () => {
    window.location.href = 'login.html';
});

document.getElementById('logoutButton').addEventListener('click', () => {
    fetch('/users/logout', {
        method: 'GET',
        credentials: 'include'
    }).then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Logout failed');
        }
    });
});

// check user login
function checkLoginStatus() {
    return fetch('/users/user', {
        method: 'GET',
        credentials: 'include'
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('User not authenticated');
        }
    });
}

fetch('/users/user', {
    method: 'GET',
    credentials: 'include'
})
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('User not authenticated');
        }
    })
    .then(user => {
        // Αν ο χρήστης είναι συνδεδεμένος, εμφανίζουμε το όνομα του και αποκρύπτουμε το κουμπί Login
        document.getElementById('loggedInUser').textContent = `Logged in as: ${user.user.username}`;
        document.getElementById('loggedInUser').style.display = 'block';
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
    })
    .catch(error => {
        // Αν ο χρήστης δεν είναι συνδεδεμένος, εμφανίζουμε το κουμπί Login και αποκρύπτουμε το όνομα του χρήστη
        console.error('User not authenticated:', error);
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('loggedInUser').style.display = 'none';
        document.getElementById('loginButton').style.display = 'block';
    });

// fetchCurrencyRates to load the currency
document.getElementById('currencyDropdown').addEventListener('change', (event) => {
    selectedCurrency = event.target.value;
    updatePricesWithSelectedCurrency();
});

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
            console.log(category._id);
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
            li.dataset.item = JSON.stringify(item); // Αποθηκεύουμε το αντικείμενο στο dataset

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
    checkLoginStatus().then(data => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${item.name} προστέθηκε στο καλάθι.`);
        console.log(cart);
    }).catch(error => {
        window.location.href = 'login.html';
    });
}

//api kanei metatropes mono apo eur
function updatePricesWithSelectedCurrency() {
    const categoryItemsList = document.getElementById('categoryItems');
    Array.from(categoryItemsList.children).forEach(li => {
        const item = JSON.parse(li.dataset.item); // Ανάκτηση του αντικειμένου από το dataset
        const eurPriceFloat = parseFloat(item.price);

        if (selectedCurrency !== "EUR") {
            li.textContent = `${item.name} - ${item.description} - ${convertPriceToCurrency(eurPriceFloat, selectedCurrency)}`;

            // Add button cart insert again

            //TO FIX na pernaw sto cart το σωστο νομισμα ???

            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Προσθήκη στο Καλάθι';
            addToCartButton.addEventListener('click', () => {
                addToCart(item);
                console.log("eftasa edw");
            });
            li.appendChild(addToCartButton);
        } else {
            li.textContent = `${item.name} - ${item.description} - ${convertPriceToEur(eurPriceFloat, item.currency)}`;
            // Add button cart insert again
            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Προσθήκη στο Καλάθι';
            addToCartButton.addEventListener('click', () => {
                addToCart(item);
                console.log("eftasa edw");
            });
            li.appendChild(addToCartButton);
        }

        li.dataset.item = JSON.stringify(item); // Ενημέρωση του dataset με το αντικείμενο
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
        return price.toFixed(2) + ' EUR';
    }
    //αναλογα με το τι θελει ο user
    let rate = 1;
    for (const cr in currencyRates) {
        if (currencyRates.hasOwnProperty(cr)) {
            if (currency === cr) {
                rate = currencyRates[cr];
            }
        }
    }
    if (rate) {
        const convertedPrice = price * rate;
        return convertedPrice.toFixed(2) + ' ' + currency;
    } else {
        return 'Μη διαθέσιμος συντελεστής μετατροπής';
    }
}

//αν ειναι ευρω θελω διαίρεση γιατί ειναι vs προς ευρω
function convertPriceToEur(price, currency) {
    let rate = 1;
    for (const cr in currencyRates) {
        if (currencyRates.hasOwnProperty(cr)) {
            if (currency === cr) {
                rate = currencyRates[cr];
            }
        }
    }
    if (rate) {
        const convertedPrice = price / rate;
        return convertedPrice.toFixed(2) + ' ' + "EUR";
    } else {
        return 'Μη διαθέσιμος συντελεστής μετατροπής';
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


    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }

    //if (window.location.pathname === '/orders.html') {
    //    getAllOrders();
    //}
});
