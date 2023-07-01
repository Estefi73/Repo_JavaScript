let carritoLista = []; //Array carrito vacio.
let productos = [];

const DiaPadre = new Date('Jun 18 2023');
const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);

const nombreDelDiaSegunFecha = fecha => [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
][new Date(fecha).getDay()];

//Capturador
const listaStock = document.querySelector("#lista-stock");
const carrito = document.querySelector("#carrito");

//Fetch
fetch("../json/productos.json")
    .then(respProd=>respProd.json())
    .then((data)=>{
        productosTienda(data)
    })
    
//Creo tantas tarjetas como productos desde la API.
const productosTienda = async (data) => {
    productos = data; //Guardo el array obtenido del fetch en un nuevo array.

    productos.forEach((prod,indice) => {
        let tarjetaTienda = document.createElement("div");
        tarjetaTienda.classList.add("card", "col-sm-12", "col-lg-3");
        tarjetaTienda.innerHTML =
        `
        <img src="${prod.imagen}" class="card-img-top" alt="mates pintados">
        <div class="card-body">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">ARS ${prod.precio}</p>
          <a href="#carrito" class="btn btn-success" onclick="agregarCarrito(${indice})">Agregar al carrito</a>
        </div>
        `;
        listaStock.appendChild(tarjetaTienda);
    })
}

//Función para agregar productos seleccionados al carrito.
const agregarCarrito = async (indice) => {
    //Libreria.
    Toastify({
        text: "PRODUCTO AGREGADO",
        offset: {
            x: 500, 
            y: 10 
        },
        style: {
            background: "linear-gradient(to right, #8c1983, #a34ba1, #bb74bf, #d39bdc, #ecc2f8)"
        }
    }).showToast();

    const click = carritoLista.findIndex((producto) => {
        return producto.id === productos[indice].id
    })

    if (click === -1) {
        const productoAgregado = productos[indice];
        productoAgregado.cantidad = 1; //Creo una nueva propiedad.
        carritoLista.push(productoAgregado); //Agrego el nuevo producto al carrito.
        guardarStorage(); //Alamacenar LocalStorage.
        templateCarrito(); //Dibujo carrito.
    } else {
        productos[indice].cantidad += 1; //Sumo cantidad 1 al productos existente en el carrito.
        guardarStorage(); //Alamacenar LocalStorage.
        templateCarrito(); //Dibujo carrito.
    }
}

//Función dibujar carrito de compras.
const templateCarrito = () => {
    let totalCompra = carritoLista.reduce((acc, elementos) => acc + elementos.precio * elementos.cantidad, 0);

    carrito.className = "lista-carrito";
    carrito.innerHTML = "";
    carritoLista.forEach((producto, indice) => { //Recorro el carrito
        let contenedorCarrito = document.createElement("tr"); //Creo un elemento tr.
        contenedorCarrito.innerHTML = //Lo inserto en el HTML
        `
        <td><img src="${producto.imagen}" width=50 height=50></td>
        <td>${producto.cantidad}</td>
        <td>$ ${producto.precio}</td>
        <td>$ ${producto.precio * producto.cantidad}</td>
        <td><a href="#" class="btn btn-success" onclick="eliminarProducto(${indice})">X</a></td>
        `;
        carrito.appendChild(contenedorCarrito);
    });

    let total = document.createElement("div");
    total.innerHTML =
    `
    <p class="text-center fw-bold">Total Compra: ARS ${totalCompra}</p>
    <div class="d-flex justify-content-center"><button class="btn btn-success" href="#" onclick="comprarProductos()">COMPRAR</button></div>
    `;
    carrito.appendChild(total);

}

//Función eliminar producto del carrito.
const eliminarProducto = (i) => {
    carritoLista.forEach((p) => { //Recorro el carrito
        if (p.id === carritoLista[i].id) {
            carritoLista.splice(i, 1); //Elimino el elemento "i" del array carritoLista.
            guardarStorage(); //Almacenar LocalStorage
            templateCarrito(); //Dibujar carrito.
        }
    })
}

//Función enviar compra.
const comprarProductos = () => {
    carrito.className = "enviar-carrito";
    carrito.innerHTML = "";
    let envio = document.createElement("div"); //Creo elemento "div"

    let totalCompra = carritoLista.reduce((acc, elementos) => acc + elementos.precio * elementos.cantidad, 0);
    
    //Determino si el carrito no está vacio. Si esta vacio, indico que no hay productos seleccionados.
    if (carritoLista && (carritoLista.length > 0)) { 

        if((nombreDelDiaSegunFecha(Date.now()) === 'martes')||(DiaPadre.getTime() === hoy.getTime())){
            let descuento = totalCompra * 0.2;
            envio.innerHTML =
            `
            <h4 class="text-success text-center">Se le aplicará un descuento del 20%</h4>
            <h4 class="text-success border-bottom border-success mt-3">Su compra total es de ARS ${descuento}</h4>
            <div class="d-flex justify-content-center"><button class="btn btn-success" href="#" onclick="enviarCompra()">FORMULARIO PARA ENVIAR PRODUCTOS</button></div>
            `;
        }else{
            envio.innerHTML =
            `
            <h4 class="text-success border-bottom border-success">Su compra total es de $ ${totalCompra}</h4>
            <div class="d-flex justify-content-center"><button class="btn btn-success" href="#" onclick="enviarCompra()">FORMULARIO PARA ENVIAR PRODUCTOS</button></div>
            `;
        }
    } else {
        envio.innerHTML =
        `
        <h4 class="text-success border-bottom border-success mt-3">No hay productos seleccionados.</h4>
        `;
    }
    carrito.appendChild(envio);

    carritoLista = []; //Vacio el carrito luego de realizar la compra.
}

//Envio de la compra
const enviarCompra = () => {
    carrito.className = "formulario-carrito";
    carrito.innerHTML = "";
    let formulario = document.createElement("div"); //Creo elemento "div"
    formulario.innerHTML = 
    `
    <form>
        <div class="mb-3">
            <label for="inputName" class="form-label">Nombre y Apellido</label>
            <input type="text" class="form-control" id="inputName">
        </div>
        <div class="mb-3">
            <label for="inputEmail" class="form-label">Dirección de Email</label>
            <input type="email" class="form-control" id="inputEmail">
            <div id="emailHelp" class="form-text">Al email coordinamos el pago y envio de los productos.</div>
        </div>
        <button type="submit" class="btn btn-success" id="button">Enviar</button>
    </form>
    `;
    carrito.appendChild(formulario);

    const formularioName = document.querySelector("#inputName");
    const formularioEmail = document.querySelector("#inputEmail");
    const formularioButton = document.querySelector("#button");

    formularioEnvio(formularioName, formularioEmail, formularioButton);
}

//Función datos del clientes para el envio de los productos.
const formularioEnvio = (formularioName, formularioEmail, formularioButton) => {
    //Validacion del Nombre
    formularioName.addEventListener("focus", () => { formularioName.style.backgroundColor = "red"; })

    formularioName.addEventListener("blur", () => { formularioName.style.backgroundColor = ""; })

    //Validacion del Email
    formularioEmail.addEventListener("focus", () => { formularioEmail.style.backgroundColor = "red"; })

    formularioEmail.addEventListener("blur", () => { formularioEmail.style.backgroundColor = ""; })

    //Cuando se haga click sobre el boton Enviar.
    formularioButton.addEventListener("click", () => {
        carrito.className = "envio-compra";
        carrito.innerHTML = "";
        let compra = document.createElement("div");
        compra.innerHTML =
        `
        <h5 class="text-success text-center border-bottom border-success mt-3">¡MUCHAS GRACIAS ${formularioName.value} POR SU COMPRA!</h5>
        `;
        carrito.appendChild(compra);

    })
}

//Función para guardar carrito en el LocalStorage.
const guardarStorage = () => {
    localStorage.setItem("keyCarrito", JSON.stringify(carritoLista));
}

if (localStorage.getItem("keyCarrito")) {
    carritoLista = JSON.parse(localStorage.getItem("keyCarrito"));
    templateCarrito();
}
