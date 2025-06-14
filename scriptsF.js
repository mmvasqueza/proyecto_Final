// Desarrollador: Marcelo Vasquez
// Función Menu Lateral Desplegable

//FUNCIONALIDAD DEL DASHBOARD
const allDropdown = document.querySelectorAll('#menuLateral .menuLateral__side-dropdown');
const sidebar = document.getElementById('menuLateral');

allDropdown.forEach(item=> {
	const a = item.parentElement.querySelector('a:first-child');
	a.addEventListener('click', function (e) {
		e.preventDefault();

		if(!this.classList.contains('active')) {
			allDropdown.forEach(i=> {
				const aLink = i.parentElement.querySelector('a:first-child');

				aLink.classList.remove('active');
				i.classList.remove('show');
			})
		}
		this.classList.toggle('active');
		item.classList.toggle('show');
	})
})

// COLAPSO DE LA BARRA LATERAL
const toggleSidebar = document.querySelector('nav .nav__toggle-sidebar');
const allSideDivider = document.querySelectorAll('#menuLateral .nav__divider');
console.log(toggleSidebar)

if(sidebar.classList.contains('hide')) {
	allSideDivider.forEach(item=> {
		item.textContent = '-'
	})
	allDropdown.forEach(item=> {
		const a = item.parentElement.querySelector('a:first-child');
		a.classList.remove('active');
		item.classList.remove('show');
	})
} else {
	allSideDivider.forEach(item=> {
		item.textContent = item.dataset.text;
	})
}

toggleSidebar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');

	if(sidebar.classList.contains('hide')) {
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})

		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
	} else {
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})

sidebar.addEventListener('mouseleave', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})
	}
})

sidebar.addEventListener('mouseenter', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})

// PROFILE DROPDOWN
const profile = document.querySelector('nav .nav__profile');
const imgProfile = profile.querySelector('.nav__profile-img');
const dropdownProfile = profile.querySelector('.nav__profile-link');

imgProfile.addEventListener('click', function () {
	dropdownProfile.classList.toggle('show');
})

// MENU
const allMenu = document.querySelectorAll('main .data__content-data .head .menu');
allMenu.forEach(item=> {
	const icon = item.querySelector('.icon');
	const menuLink = item.querySelector('.menu-link');

	icon.addEventListener('click', function () {
		menuLink.classList.toggle('show');
	})
})



window.addEventListener('click', function (e) {
	if(e.target !== imgProfile) {
		if(e.target !== dropdownProfile) {
			if(dropdownProfile.classList.contains('show')) {
				dropdownProfile.classList.remove('show');
			}
		}
	}

	allMenu.forEach(item=> {
		const icon = item.querySelector('.icon');
		const menuLink = item.querySelector('.menu-link');

		if(e.target !== icon) {
			if(e.target !== menuLink) {
				if (menuLink.classList.contains('show')) {
					menuLink.classList.remove('show')
				}
			}
		}
	})
})

// CARGA DE CARROS DETALLADOS
document.getElementById('spinner').style.display = 'block';
    async function fetchJSON(url) {
      const res = await fetch(url);
      return res.json();
    }

    async function cargarCarritosDetallados() {
      const spinner = document.getElementById('spinner');
      const container = document.getElementById('cartsContainer');

      try {
        const [carts, users, products] = await Promise.all([
          fetchJSON('https://fakestoreapi.com/carts'),
          fetchJSON('https://fakestoreapi.com/users'),
          fetchJSON('https://fakestoreapi.com/products')
        ]);

        spinner.style.display = 'none';

        for (const cart of carts) {
          const user = users.find(u => u.id === cart.userId);
          const productos = cart.products.map(item => {
            const producto = products.find(p => p.id === item.productId);
            return {
              ...producto,
              cantidad: item.quantity
            };
          });

          const productosHTML = productos.map(p => `
            <div class="d-flex mb-3">
              <img src="${p.image}" alt="${p.title}" class="product-img me-3 rounded border bg-white" />
              <div>
                <h6 class="mb-1">${p.title}</h6>
                <p class="product-description mb-1">${p.description}</p>
                <div><strong>Precio:</strong> $${p.price.toFixed(2)} <span class="badge bg-success ms-2">x${p.cantidad}</span></div>
                <small class="text-muted">Categoría: ${p.category}</small>
              </div>
            </div>
          `).join('');

          const cardHTML = `
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">🧾 Carrito #${cart.id} <span class="text-muted fs-6">(${new Date(cart.date).toLocaleDateString()})</span></h5>
                  <hr>
                  <h6><i class="bi bi-person-circle me-2"></i>Usuario: ${user.name.firstname} ${user.name.lastname}</h6>
                  <p class="mb-1"><strong>Email:</strong> ${user.email}</p>
                  <p class="mb-1"><strong>Teléfono:</strong> ${user.phone}</p>
                  <p class="mb-1"><strong>Dirección:</strong> ${user.address.street}, ${user.address.city}, ${user.address.zipcode}</p>
                  <hr>
                  <h6 class="mb-3">🛍️ Productos:</h6>
                  ${productosHTML}
                </div>
              </div>
            </div>
          `;

          container.insertAdjacentHTML('beforeend', cardHTML);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        spinner.innerHTML = `
          <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>Error al cargar los carritos. Intenta más tarde.
          </div>
        `;
      }
    }

    cargarCarritosDetallados();
