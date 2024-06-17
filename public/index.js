document.getElementById('viewCartButton').addEventListener('click', () => {
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
        .then(data => {
            const user = data.user;
            if (user) {
                window.location.href = 'cart.html';
            }
        })
        .catch(error => {
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
    .then(data => {
        const user = data.user;
        if (user) {
            document.getElementById('loggedInUser').textContent = `Logged in as: ${user.username}`;
            document.getElementById('loggedInUser').style.display = 'block';
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('User not authenticated:', error);
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('loggedInUser').style.display = 'none';
        document.getElementById('loginButton').style.display = 'block';
    });

// Fetch categories and display them
fetch('/categories')
    .then(response => response.json())
    .then(categories => {
        const categoryList = document.getElementById('categoryList');
        //categoryList.innerHTML = '';
        categories.forEach(category => {
            const categoryItem = document.createElement('div');


            const categoryName = document.createElement('span');
            categoryName.textContent = category.name;
            categoryItem.appendChild(categoryName);
            categoryItem.classList.add('category-item');
            categoryItem.addEventListener('click', () => {
                window.location.href = `/category.html?id=${category._id}`;
            });
            categoryList.appendChild(categoryItem);
        });
    })
    .catch(error => console.error('Error fetching categories:', error));