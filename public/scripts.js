const baseURL = 'http://localhost:3000';


async function loginUser(event) {
    event.preventDefault();
    console.log('Form submitted');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username)
    console.log(password)
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

// Function to calculate total
//function calculateTotal(cart) {
//    return cart.reduce((total, item) => total + item.price, 0);
//}

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    const urlParams = new URLSearchParams(window.location.search);

    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }

    //if (window.location.pathname === '/orders.html') {
    //    getAllOrders();
    //}
});
