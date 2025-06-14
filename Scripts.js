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
/******************************************************/
/*Aqui comienza la manipulacion del DOM en la tabla**/
/******************************************************/ 
// items: Array que almacena los datos de los proveedores
// id: Variable que almacena el índice del proveedor a editar
// Si id está definido, significa que estamos editando un proveedor existente; si no, estamos creando uno nuevo.
// modal: Elemento del DOM que representa el modal para agregar o editar proveedores
// tbody: Elemento del DOM que representa el cuerpo de la tabla donde se mostrarán los proveedores
// Nombre, Cargo, Salario: Elementos del DOM que representan los campos de entrada del modal para agregar o editar proveedores
// BtnGuardar: Botón del modal que guarda los cambios del empleado

const modal = document.querySelector('#modalLS');
const tbody = document.querySelector('#providerTableBody');

// Elementos del modal
const Nombre = document.querySelector('#f-nombre');
const Cargo = document.querySelector('#f-cargo');
const Salario = document.querySelector('#f-salario');
const BtnGuardar = document.querySelector('#btnGuardar');
// Inicializamos las variables globales
let items;
let id;

function AbrirModal(edit = false, index = 0) {	
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modalLS') !== -1) {
      modal.classList.remove('active');
    }
  }

  if (edit) {	
    Nombre.value = items[index].Nombre
    Cargo.value = items[index].Cargo
    Salario.value = items[index].Salario
    id = index
  } 
  else {
    Nombre.value = ''
    Cargo.value = ''
    Salario.value = ''
  }
  
}

function EditarItem(index) {
  AbrirModal(true, index)
}

function BorrarItem(index) {
  items.splice(index, 1)
  AsignarItemsBD()
  CargarDatos()
}

function insertarItem(items, index) {
  let tr = document.createElement('tr');

  tr.innerHTML =  `<td>${items.Nombre}</td>
				   <td>${items.Cargo}</td>
					<td>C$ ${items.Salario}</td>
					<td class="opciones">
						<button onclick="EditarItem(${index})">
							<i class='bx bx-edit' ></i>
						</button>
					</td>
					<td class="opciones">
						<button onclick="BorrarItem(${index})">
							<i class='bx bx-trash'></i>
						</button>
					</td>
				`
  tbody.appendChild(tr);
}
  //Inmediatamente salimos si los campos estan vacios
BtnGuardarP.onclick = e => {
  if (Nombre.value == '' || Cargo.value == '' || Salario.value == '') {
	//alert('Por favor, complete todos los campos.')
	return
  }

  e.preventDefault();

  if (id !== undefined) {
    items[id].Nombre = Nombre.value
    items[id].Cargo = Cargo.value
    items[id].Salario = Salario.value
  } 
  else {
    items.push({'Nombre': Nombre.value, 
				'Cargo' : Cargo.value,
				'Salario': Salario.value });
  }

  AsignarItemsBD()

  modal.classList.remove('active')
  CargarDatos()
  id = undefined
}

function CargarDatos() {
  items = ObtenerItemsBD();
  tbody.innerHTML = ''
  items.forEach((item, index) => {
    insertarItem(item, index)
  });
}

const ObtenerItemsBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const AsignarItemsBD = () => localStorage.setItem('dbfunc', JSON.stringify(items)) ;

CargarDatos()
//Aqui termina el JS de la tabla que usa local storage

/***********************************************************************/
const API_USUARIOS = 'https://fakestoreapi.com/users';
const API_AUTORIZACION = 'https://fakestoreapi.com/auth/login';
const API_PRODUCTOS = 'https://fakestoreapi.com/products';
const API_COMPRAS = 'https://fakestoreapi.com/carts';

//Es opcional utilizarlo de esta forma
const credenciales = {
	"username": "johnd",
	"password": "m38rmF$"
};

// Variables del DOM
const Modal = document.querySelector('#modalAPI');
const tableBody = document.getElementById('productTableBody');
const form = document.getElementById('productsForm');
//console.log(form);
const searchInput = document.getElementById('searchInput');
//const pagination = document.getElementById('pagination');
let Usuarios = [];
let products = [];
let filtroProductos = [];
let PaginaInicial = 1;
let ItemsXPagina = 20;

const closeBtn = document.querySelector('.close-btn');;

closeBtn.addEventListener('click', () => {
  //Modal.style.display = 'none';
  location.reload();
});


function OpenModal(edit = false, index = 0) {	
  Modal.classList.add('active');

  Modal.onclick = e => {
    if (e.target.className.indexOf('modalAPI') !== -1) {
      Modal.classList.remove('active');
    }
  }
  if (edit) {	
	document.getElementById('productid').value = product.id;
	document.getElementById('producto').value = product.title;
	document.getElementById('precio').value = product.price;
	document.getElementById('categoria').value = product.category;

    // Nombre.value = items[index].Nombre
    // Cargo.value = items[index].Cargo
    // Salario.value = items[index].Salario
    // id = index
  } 
  else {
    Nombre.value = ''
    Cargo.value = ''
    Salario.value = ''
  }
  
}




//Solicitamos la lista de usuarios y autenticamos al usuario
// Esta función obtiene la lista de usuarios y realiza la autenticación del primer usuario en la lista.
// Si la autenticación es exitosa, se imprime el token en la consola.
// Si hay un error en la autenticación, se captura y se imprime un mensaje de error en la consola.
// La función utiliza la API de usuarios y la API de autorización para obtener los datos necesarios.
// La autenticación se realiza enviando el nombre de usuario y la contraseña del primer usuario en la lista a la API de autorización.
// La respuesta de la API de autorización se maneja para verificar si la autenticación fue exitosa y se obtiene el token.
async function fetchUsuarios() {
	const respuesta = await fetch(API_USUARIOS)
	Usuarios = await respuesta.json();
	console.log('Lista de usuarios del sistema: ',Usuarios);
	// Autenticación
	var authResponse = await fetch(API_AUTORIZACION, {	
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({'username': `${Usuarios[0].username}` , 'password':`${Usuarios[0].password}`})
		
	})
	return authResponse.json()
	//promesas en javascripts
	.then(data => {
      console.log('Token generado con exito:', data);  // Muestra los datos en formato JSON
    })
	
	//promesas en javascripts
	.then(authResponse => {	
		  if (authResponse == 200) {
        // ✅ Respuesta OK
		return authResponse.json();
	}
	})	
	
}

//Metodo principal de los productos
async function obtenerDatos() {


	// Autenticación
	// Esta función obtiene un token de autenticación utilizando las credenciales proporcionadas.
	// Utiliza la API de autorización para enviar una solicitud POST con las credenciales.
	// Si la autenticación es exitosa, se imprime el token en la consola.
	// Si hay un error en la autenticación, se captura y se imprime un mensaje de error en la consola.
	var authResponse = await fetch(API_AUTORIZACION, {	
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(credenciales)		
	})

	var token = await authResponse.json();
	//Mostramos en la consola la respuesta de la API
	console.log('Token de autenticación:', token.token);
	//Ahora que ya tenemos el token de autorizacion podemos consultar los productos
 	const respuesta = await fetch(API_PRODUCTOS, {
		headers: {
			'Authorization': `Bearer ${token.token}`,
			'Content-Type': 'application/json'
		}	
	})

	products = await respuesta.json();
	//Mostramos la lista de productos
	console.log('Lista de Productos:', products);
	filtroProductos = [...products];
	//Invocamos la funcion para insertar los datos a la tabla
	rederTable();
	//renderPagination();

	//Aqui intentamos acceder a otro modulo de la API llamado carrito de compra que es opcion FACTURAR
	var carts = await fetch(API_COMPRAS, {
		headers: {
			'Authorization': `Bearer ${token.token}`,
			'Content-Type': 'application/json'	
		}
	})
	var compras = await carts.json();
	//Mostramos la lista de productos comprados por cada usuario 
	console.log('Lista de Compras:', compras);



}

obtenerDatos();







//fetchUsuarios();
async function fetchProductos() {
	const respuesta = await fetch(API_PRODUCTOS);
	products = await respuesta.json();
	filtroProductos = [...products];
	rederTable();
	//renderPagination();
}

function rederTable(){
	tableBody.innerHTML = '';

	//Logica Paginacion
	 const inicio = (PaginaInicial - 1) * ItemsXPagina
	 const fin = inicio + ItemsXPagina;
	const ItemsActualizados = filtroProductos.slice(inicio,fin);

	ItemsActualizados.forEach(product => {
		const row = document.createElement('tr');

		const EditarProducto = document.createElement('button');
		EditarProducto.className = 'opciones';
		EditarProducto.innerHTML = "<i class='bx bx-edit'></i>";
		EditarProducto.addEventListener('click',() => editProduct(products));

 
		const EliminarProducto = document.createElement('button');
		EliminarProducto.className = 'opciones';
		EliminarProducto.innerHTML = "<i class='bx bx-trash'></i>";
		EliminarProducto.addEventListener('click',() => deleteProduct(product.id));

		row.innerHTML =  `	<td>${product.id}</td>
							<td>${product.title}</td>
							<td>${product.price}</td>
							<td>${product.category}</td>`;

		const actionCellEdit = document.createElement('td');
		actionCellEdit.appendChild(EditarProducto);
		row.appendChild(actionCellEdit);

		const actionCellDelete = document.createElement('td');
		actionCellDelete.appendChild(EliminarProducto);
		row.appendChild(actionCellDelete);

		tableBody.appendChild(row);            
	});
}

function editProduct(product){
	OpenModal(true, product.id);
	document.getElementById('productid').value = product.id;
	document.getElementById('producto').value = product.title;
	document.getElementById('precio').value = product.price;
	document.getElementById('categoria').value = product.category;
	
}


// function EditarProducto(index) {
//   OpenModal(true, index)
// }
form.addEventListener('submit', async(e) => {
	e.preventDefault();

	const id = document.getElementById('productid').value;
	const title = document.getElementById('producto').value;            
	const price = parseFloat(document.getElementById('precio')).value ;            
	const category = document.getElementById('categoria').value;

	const productsData = { title, price, category, description : '' , image: ''};


	 
	if(id) //Actualizamos productos
	{
		await fetch(`${API_PRODUCTOS}/${id}`,{
			method : 'PUT',
			headers : {'content-Type':'application/json'},
			body: JSON.stringify(productsData)
		});
	}
	else //Insertamos productos
	{
		await fetch(`${API_PRODUCTOS}`,{
			method : 'POST',
			headers : {'content-Type':'application/json'},
			body: JSON.stringify(productsData)
		});
	}

	form.reset();
	document.getElementById('productid').value = '';
	fetchProductos();
});

//Eliminamos productos
async function deleteProduct(id) {
		await fetch(`${API_PRODUCTOS}/${id}`,{ method : 'DELETE'});
		fetchProductos();
}





fetchProductos();
fetchUsuarios();