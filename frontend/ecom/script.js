// Check if user is logged in

  
  // Logout function
  function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
  
  // Function to load content dynamically
  async function loadContent(page) {
    const mainContent = document.getElementById('main-content');
    try {
      const response = await fetch(`${page}.html`);
      if (!response.ok) throw new Error('Page not found');
      const html = await response.text();
      mainContent.innerHTML = html;
  
      // Load additional scripts or functionality for specific pages
      if (page === 'products') {
        onit()
      } else if (page === 'cart') {
        displayCart();
      } else if (page === 'orders') {
        displayOrders();
      }
    } catch (error) {
      mainContent.innerHTML = `<h1>Error Loading Page</h1><p>${error.message}</p>`;
    }
  }
  
  // Function to handle navigation
  function handleNavigation(event) {
    event.preventDefault();
    const page = event.target.getAttribute('data-page');
    loadContent(page);
  }
  
  // Add event listeners to navbar links
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
 
 
  
  // Add product form
  function showAddProductForm() {
    document.getElementById('add-product-form').style.display = 'block';
  }
  
 
  // Check login status on page load
 

  // Base URL for JSON Server API
const API_URL = 'http://localhost:4001';


// 
// 


function showLogin() {
    console.log( document.querySelectorAll('.auth-form'));
    
    document.querySelectorAll('.auth-form').forEach(form => form.style.display = 'none');
    document.querySelector('.auth-form').style.display = 'block';
  }
  
  // Show register form
  function showRegister() {
    document.querySelectorAll('.auth-form').forEach(form => form.style.display = 'none');
    document.querySelectorAll('.auth-form')[1].style.display = 'block';
  }
  

  // Check if user is logged in before accessing protected pages
function checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('You must be logged in to access this page.');
        window.location.href = 'login.html';
    }
}

// Call checkLoginStatus on protected pages
if (['index.html', 'products.html', 'cart.html'].some(page => window.location.pathname.endsWith(page))) {
    checkLoginStatus();
}

async function login(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:4001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Login successful');
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            alert(`Login failed: ${error.message}`);
        }
    } catch (err) {
        console.error('Error during login:', err);
        alert('An error occurred during login.');
    }
}

async function register(event) {
    event.preventDefault();
    const username = document.getElementById('name').value;
    const email = document.getElementById('registermail').value;
    const password = document.getElementById('registerpwd').value;

    try {
        const response = await fetch('http://localhost:4001/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Registration successful');
            window.location.href = 'login.html';
        } else {
            const error = await response.json();
            alert(`Registration failed: ${error.message}`);
        }
    } catch (err) {
        console.error('Error during registration:', err);
        alert('An error occurred during registration.');
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:4001/api/products');
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';

  products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
          <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.productname}">
          <h3>${product.productname}</h3>
          <p>$${product.price}</p>
          <p>${product.description}</p>
          <button class="add-to-cart">Add to Cart</button>
      `;

      // Add event listener to button
      const addButton = productCard.querySelector('.add-to-cart');
      addButton.addEventListener('click', () => {
          addToCart(product._id);
      });

      container.appendChild(productCard);
  });
}

// Initial load
fetchProducts();

// Close modal on ESC key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

//cart

  window.onload=onit


// Fixed the onit function and ensured proper error handling for fetchProducts

async function onit() {
    try {
        const data = await fetchProducts();
        if (data && data.products) {
            displayProducts(data.products);
        } else {
            console.error('No products found');
        }

        const searchbar = document.getElementById('searchbar');
        if (searchbar) {
            searchbar.addEventListener('input', () => {
                const filterproducts = searchProducts(data.products, searchbar.value);
                displayProducts(filterproducts);
            });
        } else {
            console.error('Search bar not found');
        }
    } catch (error) {
        console.error('Error initializing products:', error);
    }
}

function searchProducts(products, inputValue) {
    return products.filter(product => product.productname.toLowerCase().includes(inputValue.toLowerCase()));
}

// Function to add a product to the cart
async function addToCart(productId) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user._id) {
      alert('Please log in to add products to the cart.');
      window.location.href = 'login.html';
      return;
  }

  try {
      const response = await fetch(`http://localhost:4001/api/cart/${user._id}/${productId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ quantity: 1 }) // Optional: adjust quantity handling as needed
      });

      if (response.ok) {
          alert('Product added to cart successfully!');
      } else {
          const error = await response.json();
          alert(`Failed to add product to cart: ${error.message}`);
      }
  } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('An error occurred while adding the product to the cart.');
  }
}

// Function to display the logged-in user's cart items
async function displayCart() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to view your cart.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:4001/api/cart/${user._id}`, {
            headers: {
                'Authorization': `Bearer ${user}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const cartContainer = document.getElementById('cartContainer');
            cartContainer.innerHTML = ''; // Clear previous content

            data.carts.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <img src="${item.productid.image || 'https://via.placeholder.com/150'}" alt="${item.productid.productname}" class="cart-item-image">
                        <div>
                            <h3>${item.productid.productname}</h3>
                            <p>Price: $${item.productid.price}</p>
                            <p>Quantity: ${item.quantity}</p>
                        </div>
                    </div>
                    <button onclick="removeFromCart('${item._id}')">Remove</button>
                `;
                cartContainer.appendChild(cartItem);
            });
        } else {
            const error = await response.json();
            alert(`Failed to fetch cart items: ${error.message}`);
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
        alert('An error occurred while fetching the cart items.');
    }
}

// Function to place an order
async function placeOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
        alert('Please log in to place an order.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:4001/api/orders/${user._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                productids: [], // Add product IDs from the cart here
                shippingaddress: '123 Main St', // Replace with actual address input
                status: 'Pending'
            })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Order placed successfully!');
            window.location.href = 'orders.html';
        } else {
            const error = await response.json();
            alert(`Failed to place order: ${error.message}`);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('An error occurred while placing the order.');
    }
}

// Function to display user orders
async function displayOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
        alert('Please log in to view your orders.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:4001/api/orders/userorderhistory/${user._id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const ordersContainer = document.getElementById('ordersContainer');
            if (ordersContainer) {
                ordersContainer.innerHTML = ''; // Clear previous content

                data.orders.forEach(order => {
                    const orderItem = document.createElement('div');
                    orderItem.className = 'order-item';
                    orderItem.innerHTML = `
                        <h3>Order ID: ${order._id}</h3>
                        <p>Total Price: $${order.totalprice}</p>
                        <p>Status: ${order.status}</p>
                        <p>Products:</p>
                        <ul>
                            ${order.productids.map(p => `<li>${p.productid.productname} (x${p.quantity})</li>`).join('')}
                        </ul>
                        <button onclick="cancelOrder('${order._id}')">Cancel Order</button>
                    `;
                    ordersContainer.appendChild(orderItem);
                });
            } else {
                console.error('Orders container element not found');
            }
        } else {
            const error = await response.json();
            alert(`Failed to fetch orders: ${error.message}`);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        alert('An error occurred while fetching the orders.');
    }
}

// Order placement popup functions
function openOrderPopup() {
    const orderPopup = document.getElementById('orderPopup');
    if (orderPopup) {
        orderPopup.style.display = 'block';
    } else {
        console.error('Order popup element not found');
    }
}

function closeOrderPopup() {
    const orderPopup = document.getElementById('orderPopup');
    if (orderPopup) {
        orderPopup.style.display = 'none';
    } else {
        console.error('Order popup element not found');
    }
}

// Updated placeOrder function to take all cart products and handle delivery address
async function placeOrder(event) {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
        alert('Please log in to place an order.');
        window.location.href = 'login.html';
        return;
    }

    const shippingAddress = document.getElementById('shippingAddress')?.value;
    const paymentMethod = document.getElementById('paymentMethod')?.value;

    if (!shippingAddress || !paymentMethod) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        // Fetch cart items for the user
        const cartResponse = await fetch(`http://localhost:4001/api/cart/${user._id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!cartResponse.ok) {
            const error = await cartResponse.json();
            alert(`Failed to fetch cart items: ${error.message}`);
            return;
        }

        const cartData = await cartResponse.json();
        const productIds = cartData.carts.map(item => ({
            productid: item.productid._id,
            quantity: item.quantity
        }));

        // Call place order API
        const orderResponse = await fetch(`http://localhost:4001/api/orders/${user._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                productids: productIds,
                shippingaddress: shippingAddress,
                paymentmethod: paymentMethod,
                status: 'pending',
                paymentstatus: 'pending',
                orderdate: new Date().toISOString(),
                deliverydate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
            })
        });

        if (orderResponse.ok) {
            alert('Order placed successfully!');
            closeOrderPopup();
            window.location.href = 'cart.html';
        } else {
            const error = await orderResponse.json();
            alert(`Failed to place order: ${error.message}`);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('An error occurred while placing the order.');
    }
}

// Updated displayOrders function to include cancel order functionality
async function displayOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
        alert('Please log in to view your orders.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:4001/api/orders/history/${user._id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const ordersContainer = document.getElementById('ordersContainer');
            if (ordersContainer) {
                ordersContainer.innerHTML = ''; // Clear previous content

                data.orders.forEach(order => {
                    const orderItem = document.createElement('div');
                    orderItem.className = 'order-item';
                    orderItem.innerHTML = `
                        <h3>Order ID: ${order._id}</h3>
                        <p>Total Price: $${order.totalprice}</p>
                        <p>Status: ${order.status}</p>
                        <p>Products:</p>
                        <ul>
                            ${order.productids.map(p => `<li>${p.productid.productname} (x${p.quantity})</li>`).join('')}
                        </ul>
                        <button onclick="cancelOrder('${order._id}')">Cancel Order</button>
                    `;
                    ordersContainer.appendChild(orderItem);
                });
            } else {
                console.error('Orders container element not found');
            }
        } else {
            const error = await response.json();
            alert(`Failed to fetch orders: ${error.message}`);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        alert('An error occurred while fetching the orders.');
    }
}

// Cancel order function
async function cancelOrder(orderId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
        alert('Please log in to cancel an order.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:4001/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            alert('Order canceled successfully!');
            displayOrders(); // Refresh the orders display
        } else {
            const error = await response.json();
            alert(`Failed to cancel order: ${error.message}`);
        }
    } catch (error) {
        console.error('Error canceling order:', error);
        alert('An error occurred while canceling the order.');
    }
}
function placeOrder() {
  // Show the order popup
  document.getElementById('orderPopup').style.display = 'flex';
}

function closeOrderPopup() {
  // Hide the order popup
  document.getElementById('orderPopup').style.display = 'none';
}

document.getElementById('orderForm').addEventListener('submit', function(event) {
  event.preventDefault();
  // Handle order confirmation logic here
  // For example, collect form data and send it to the server

  // Close the popup after order is placed
  closeOrderPopup();
});

function removeFromCart(productId) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user._id) {
      alert('Please log in to remove products from the cart.');
      window.location.href = 'login.html';
      return;
  }

  fetch(`http://localhost:4001/api/cart/${user._id}/${productId}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${user.token}`
      }
  })
  .then(response => {
      if (response.ok) {
          alert('Product removed from cart successfully!');
          displayCart(); // Refresh the cart display
      } else {
          return response.json().then(error => {
              alert(`Failed to remove product from cart: ${error.message}`);
          });
      }
  })
  .catch(error => {
      console.error('Error removing product from cart:', error);
      alert('An error occurred while removing the product from the cart.');
  });
}

function displayCart() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
      alert('Please log in to view your cart.');
      window.location.href = 'login.html';
      return;
  }

  fetch(`http://localhost:4001/api/cart/${user._id}`, {
      headers: {
          'Authorization': `Bearer ${user.token}`
      }
  })
  .then(response => response.json())
  .then(data => {
      const cartContainer = document.getElementById('cartContainer');
      cartContainer.innerHTML = ''; // Clear previous content

      data.carts.forEach(item => {
          const cartItem = document.createElement('div');
          cartItem.className = 'cart-item';
          cartItem.innerHTML = `
              <img src="${item.productid.image || 'https://via.placeholder.com/150'}" alt="${item.productid.productname}" class="cart-item-image">
              <h3>${item.productid.productname}</h3>
              <p>Price: $${item.productid.price}</p>
              <p>Quantity: ${item.quantity}</p>
              <button onclick="removeFromCart('${item.productid._id}')">Remove</button>
          `;
          cartContainer.appendChild(cartItem);
      });
  })
  .catch(error => {
      console.error('Error fetching cart items:', error);
      alert('An error occurred while fetching the cart items.');
  });
}

// Call displayCart on page load
document.addEventListener('DOMContentLoaded', displayCart);
 // Attach the placeOrder function to the form's submit event
 document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
      orderForm.addEventListener('submit', (event) => {
          event.preventDefault();
          placeOrder(event);
      });
  }
  displayOrders(); // Fetch and display all orders for the logged-in user
});

// Modal functions
function openModal() {
  const modal = document.getElementById('addProductModal');
  if (modal) {
    modal.style.display = 'block';
  } else {
    console.error('Modal element not found');
  }
}

function closeModal() {
  const modal = document.getElementById('addProductModal');
  if (modal) {
    modal.style.display = 'none';
  } else {
    console.error('Modal element not found');
  }
}
async function displayCart() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return alert('Login required');

  const res = await fetch(`http://localhost:4001/api/cart/${user._id}`);
  const data = await res.json();

  const container = document.getElementById('cartContainer');
  container.innerHTML = '';
  data.carts.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <h3>${item.productid.productname}</h3>
      <p>Price: $${item.productid.price}</p>
      <p>Quantity: ${item.quantity}</p>
      <button onclick="removeCartItem('${item._id}')">Remove</button>
    `;
    container.appendChild(div);
  });
}

async function placeOrder(event) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));
  const shipping = document.getElementById('shippingAddress').value;
  const method = document.getElementById('paymentMethod').value;

  const cartRes = await fetch(`http://localhost:4001/api/cart/${user._id}`);
  const cartData = await cartRes.json();

  const productIds = cartData.carts.map(c => ({
    productid: c.productid._id,
    quantity: c.quantity
  }));

  const res = await fetch(`http://localhost:4001/api/orders/${user._id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productids: productIds,
      shippingaddress: shipping,
      paymentmethod: method,
      status: 'pending',
      paymentstatus: 'pending'
    })
  });

  if (res.ok) {
    alert('Order placed!');
    closeOrderPopup();
    window.location.href = 'orders.html';
  } else {
    alert('Failed to place order');
  }
}

function openOrderPopup() {
  document.getElementById('orderPopup').style.display = 'flex';
}

function closeOrderPopup() {
  document.getElementById('orderPopup').style.display = 'none';
}

document.getElementById('orderForm')?.addEventListener('submit', placeOrder);
document.addEventListener('DOMContentLoaded', displayCart);

async function displayOrders() {
  const user = JSON.parse(localStorage.getItem('user'));
  const res = await fetch(`http://localhost:4001/api/orders/userorderhistory/${user._id}`);
  const data = await res.json();

  const container = document.getElementById('ordersContainer');
  container.innerHTML = '';
  data.orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
      <h3>Order: ${order._id}</h3>
      <p>Status: ${order.status}</p>
      <p>Total: $${order.totalprice}</p>
      <ul>${order.productids.map(p => `<li>${p.productid.productname} x ${p.quantity}</li>`).join('')}</ul>
      <button onclick="cancelOrder('${order._id}')">Cancel Order</button>
    `;
    container.appendChild(div);
  });
}

async function cancelOrder(orderId) {
  const res = await fetch(`http://localhost:4001/api/orders/${orderId}`, { method: 'DELETE' });
  if (res.ok) {
    alert('Order canceled');
    displayOrders();
  } else {
    alert('Failed to cancel');
  }
}

document.addEventListener('DOMContentLoaded', displayOrders);

async function displayOrders() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user._id) {
    alert('Please log in to view your orders.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:4001/api/orders/userorderhistory/${user._id}`);
    const data = await response.json();

    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = '';

    data.orders.forEach(order => {
      const orderDiv = document.createElement('div');
      orderDiv.className = 'order-item';
      orderDiv.innerHTML = `
        <h3>Order ID: ${order._id}</h3>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total Price:</strong> $${order.totalprice}</p>
        <p><strong>Shipping Address:</strong> ${order.shippingaddress}</p>
        <p><strong>Payment Method:</strong> ${order.paymentmethod}</p>
        <ul>
          ${order.productids.map(p => `<li>${p.productid.productname} (x${p.quantity})</li>`).join('')}
        </ul>
        ${order.status !== 'cancelled' ? `<button onclick="cancelOrder('${order._id}')">Cancel Order</button>` : '<em>Order Cancelled</em>'}
      `;
      ordersContainer.appendChild(orderDiv);
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    alert('Failed to load orders.');
  }
}

async function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return;

  try {
    const response = await fetch(`http://localhost:4001/api/orders/${orderId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Order cancelled successfully.');
      displayOrders();
    } else {
      const error = await response.json();
      alert(`Failed to cancel order: ${error.message}`);
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    alert('An error occurred while cancelling the order.');
  }
}

document.getElementById('addProductForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const productName = document.getElementById('productName').value;
  const productPrice = document.getElementById('productPrice').value;
  const productDescription = document.getElementById('productDescription').value;
  const productCategory = document.getElementById('productCategory').value;
  const productImage = document.getElementById('productImage').value;
  const productRating = document.getElementById('productRating').value;
  const productStock = document.getElementById('productStock').value;

  try {
      const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              productname: productName,
              price: productPrice,
              description: productDescription,
              category: productCategory,
              image: productImage,
              rating: productRating,
              stock: productStock
          })
      });

      if (response.ok) {
          alert('Product added successfully!');
          closeModal();
          fetchProducts(); // Refresh the product list
      } else {
          const error = await response.json();
          alert(`Failed to add product: ${error.message}`);
      }
  } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product.');
  }
});

// Function to delete the entire cart for the logged-in user
async function removeCartItem(id) {
  console.log('id:', id);
  
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user._id) {
    alert('Please log in to delete your cart.');
    window.location.href = 'login.html';
    return;
  }

  if (!confirm('Are you sure you want to delete your entire cart?')) return;

  try {
    const response = await fetch(`${API_URL}/api/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (response.ok) {
      alert('Cart deleted successfully!');
      displayCart(); // Refresh the cart display
    } else {
      const error = await response.json();
      alert(`Failed to delete cart: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting cart:', error);
    alert('An error occurred while deleting the cart.');
  }
}