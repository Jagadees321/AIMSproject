// Check if user is logged in

  
  // Logout function
  function logout() {
    localStorage.removeItem('isLoggedIn');
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
const API_URL = 'http://localhost:3000';


let resbtn=document.getElementById('resbtn');
let loginpage=document.getElementById('authlogin');
let registerpage=document.getElementById('authlogin');


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
  

  async function  login(e) {
      e.preventDefault()
      let email=document.getElementById('email');
      let password=document.getElementById('password');
      console.log('data coming front login form');
      
      console.log(email.value);
      console.log(password.value);

     let res=await fetch('http://localhost:3000/users');
     let data=await res.json();



     let user=data.find((ele)=>ele.email===email.value && ele.password===password.value);

     if(user){
        alert('login success');
        window.location.href='index.html';
     }else{
        alert('user doesnt exist')
        
     }    
  }

 async function register(event) {
  event.preventDefault()
    let username=document.getElementById('name').value;
    let email=document.getElementById('registermail').value;
    let password=document.getElementById('registerpwd').value;
    console.log(username,email,password);
    fetch('http://localhost:3000/users',
      {
        method:'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username,email,password })
      }).then((res)=>console.log(res)
      ).catch((err)=>console.log(err)
      )
    
  }

  

  async function fetchProducts() {
    try {
     let res=await fetch('http://localhost:4001/api/products');
     let data=await res.json();
    
     return data;
    } catch (error) {
       console.log(error);
       
    }
 
}
  function displayproducts(products) {
     let productscontainer=document.getElementById('productscontainer');
     console.log(products);
     console.log(productscontainer);
     
     productscontainer.innerHTML=''
     products.forEach((product)=>{
         let div=document.createElement('div');
         div.className='productcard';
        
         div.innerHTML=`
           <div class="productcard">
               <img src="${product.image}" alt="" >
        <h2>${product.productname}</h2>
        <p>
            ${product.description}</p>

        <strong>price:${product.price}</strong>
       
        <strong>rating:${product.rating}</strong>
       
        <strong>discount:${0}</strong>
        
        <a href="">add to cart</a>
        </div>
         `

        productscontainer.appendChild(div);
  })
     
  }

  async function onit() {
        
        let data=await fetchProducts();
        console.log(data.products);
        let products=[...data.products]

        console.log('products',products);
        
        
        displayproducts(products)
        
        let searchbar=document.getElementById('searchbar');

        searchbar.addEventListener('input',()=>{
          console.log(searchbar.value);

         let filterproducts=searchproducts(products,searchbar.value);
         displayproducts(filterproducts);
          
        })
       
    
  }

  function searchproducts(products,inputvalue) {
    
     let filterproducts=products.filter((product)=>product.title.toLowerCase().includes(inputvalue))

     return filterproducts;
  }

  window.onload=onit