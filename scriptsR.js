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

// PROGRESSBAR
const allProgress = document.querySelectorAll('main .info-data__card .progress');

allProgress.forEach(item=> {
	item.style.setProperty('--value', item.dataset.value)
})

// APEXCHART
var options = {
series: [{
name: 'Año 2023',
data: [31, 40, 28, 51, 42, 109, 100]
},
{
name: 'Año 2024',
data: [11, 32, 45, 32, 34, 52, 41]
}],
chart: {
height: 350,
type: 'area'
},
dataLabels: {
enabled: false
},
stroke: {
curve: 'smooth'
},
xaxis: {
type: 'datetime',
categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
},
tooltip: {
x: {
format: 'dd/MM/yy HH:mm'
},
},
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();





//FUNCIONALIDAD DE LOS REPORTES DEL DASHBOARD
async function getData() {
	const res = await fetch("https://fakestoreapi.com/products");
	return await res.json();
}

function groupByCategory(products) {
	const result = {};
	for (const p of products) {
	if (!result[p.category]) result[p.category] = [];
	result[p.category].push(p);
	}
	return result;
}

async function renderCharts() {
const products = await getData();
const grouped = groupByCategory(products);

// Bar Chart - cantidad por categoría
const categories = Object.keys(grouped);
const counts = categories.map(cat => grouped[cat].length);
new ApexCharts(document.querySelector("#bar-chart"), {
chart: { type: 'bar', height: 350 },
title: { text: 'Productos por Categoría' },
series: [{ name: "Cantidad", data: counts }],
xaxis: { categories }
}).render();

// 📈 Line Chart - precio por producto (simulando evolución)
const prices = products.map(p => p.price);
const productNames = products.map(p => p.title.slice(0, 15) + "...");
new ApexCharts(document.querySelector("#line-chart"), {
chart: { type: 'line', height: 350 },
title: { text: 'Precio por Producto' },
series: [{ name: "Precio", data: prices }],
xaxis: { categories: productNames }
}).render();

// 🥧 Pie Chart - porcentaje de productos por categoría
new ApexCharts(document.querySelector("#pie-chart"), {
chart: { type: 'pie', height: 350 },
title: { text: 'Distribución por Categoría' },
labels: categories,
series: counts
}).render();

// 📉 Area Chart - ratings
const ratings = products.map(p => p.rating.rate);
new ApexCharts(document.querySelector("#area-chart"), {
chart: { type: 'area', height: 350 },
title: { text: 'Valoraciones de Productos (rating)' },
series: [{ name: "Rating", data: ratings }],
xaxis: { categories: productNames }
}).render();

// 📦 Radar Chart - precio promedio por categoría
const radarData = categories.map(cat =>
(grouped[cat].reduce((acc, p) => acc + p.price, 0) / grouped[cat].length).toFixed(2)
);
new ApexCharts(document.querySelector("#radar-chart"), {
chart: { type: 'radar', height: 350 },
title: { text: 'Precio Promedio por Categoría' },
series: [{ name: "Precio Promedio", data: radarData }],
labels: categories
}).render();
}

renderCharts();

