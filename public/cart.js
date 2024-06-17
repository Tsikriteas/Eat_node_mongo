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

checkLoginStatus().then(data => {
    const logoutButton = document.getElementById('logoutButton');
    const loggedInUser = document.getElementById('loggedInUser');

    if (logoutButton && loggedInUser) {
        logoutButton.style.display = 'inline-block';
        loggedInUser.style.display = 'block';
        loggedInUser.textContent = `Welcome, ${data.user.username}`;
    }
}).catch(error => {
    window.location.href = 'login.html';
});

//logout button
document.getElementById('logoutButton').addEventListener('click', () => {
    fetch('/users/logout', {
        method: 'GET',
        credentials: 'include'
    }).then(response => {
        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            alert('Logout failed');
        }
    });
});

function displayCartItems() {
    const cartItemsList = document.getElementById('cartItems');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsList.innerHTML = '';

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.description} - ${item.price} ${item.currency}`;

        // Create delete button
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

function calculateTotal(cart) {
    return cart.reduce((total, item) => total + item.price, 0);
}

async function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Το καλάθι είναι άδειο.');
        return;
    }

    // get user data to place the order
    try {
        const data = await checkLoginStatus();
        const user = data.user;
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const items = cart.map(item => item._id);
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const currency = 'EUR';
        const orderData = {
            items,
            total,
            currency,
            customerName: user.username,
            customerAddress: user.customerAddress,
            customerPhone: user.customerPhone
        };

        console.log("order data", orderData);

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
            alert(`Error: ${error}`);
        }
    } catch (error) {
        console.error('Error completing order:', error);
        alert('Σφάλμα κατά την ολοκλήρωση της παραγγελίας.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired'); // Προσθέστε αυτό το log

    displayCartItems();

    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }

});