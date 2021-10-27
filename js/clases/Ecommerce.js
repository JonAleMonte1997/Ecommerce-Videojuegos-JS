class ECommerce{

    constructor() {

        this.productos = [];
        this.carrito = (localStorage.carrito) ? JSON.parse(localStorage.carrito) : [];
    }

    // Método que trae los productos de la URL correspondiente y 
    // genera el catálogo si recibe una respuesta satisfactoria
    cargarProductos() {
        
        const URL = 'data/videojuegos.json';

        $.ajax({
            type: "GET",
            url: URL,
            success: (data) => {
                this.productos = data;
                this.generarCatalogo();
                this.generarFiltro()
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    //Método para generar el filtro de categorias dependiendo de las categorias que existan
    //en los datos recibidos
    generarFiltro() {

        let filtro = '<li><a class="dropdown-item btn-filtro">Todos</a></li>';

        let categorias = [];
        
        this.productos.forEach(producto => {
            if (!categorias.find(categoria => categoria == producto.categoria)) {
                categorias.push(producto.categoria);
            }
        });
        
        categorias.forEach(categoria => {
            filtro += `<li><a class="dropdown-item btn-filtro" data-categoria=${categoria}>${categoria}</a></li>`
        })

        $('#filtro').html(filtro);

        //Tras generar el html genero el evento de los botones
        this.generarEventoFiltrar();
    }

    //Método para generar la funcionalidad de filtro a los botones correspondientes
    generarEventoFiltrar() {
        
        Array.from($('.btn-filtro')).forEach(boton => {
            boton.onclick = (event) => {
                let categoria = event.target.getAttribute("data-categoria");
                this.generarCatalogo(categoria);
            }
        })
    }

    //Método que genera las cards del catalogo utilizando los productos previamente cargados
    //y dependiendo de la categoria ingresada
    generarCatalogo(categoria) {

        let catalogo = '';
        let productosParaMostrar = [];
        
        if (categoria) {
            productosParaMostrar = this.productos.filter(producto => producto.categoria == categoria);
        } else {
            productosParaMostrar = this.productos;
        }

        productosParaMostrar.forEach((producto, index) => {

            //productoEnCarrito se utiliza para ver si el producto existe en el carrito, en ese caso
            //el botón de la card se genera con la funcionalidad para sacarlo del carrito, en caso de que
            //no exista la card se genera con el botón por defecto de añadir al carrito
            let productoEnCarrito = this.carrito.find(productoCarrito => productoCarrito.nombre == producto.nombre);
            
            catalogo += `
            <div class="col-lg-4 col-sm-6 d-flex justify-content-center">
                <div id="${index}" class="card text-dark bg-light mb-3 border-dark" style="width: 18rem; display:none">
                    <img src="${producto.urlImagen}" class="card-img-top" alt="Imagen de ${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Precio: $${producto.precio}</p>   
                        <p class="card-text">Categoría: ${producto.categoria}</p>                    
                    </div>
                    <div class="card-footer">
                        <button data-id="${producto.id}" class="btn ${(productoEnCarrito) ? 'btn-danger btn-eliminar' : 'btn-dark btn-agregar'}">
                        ${(productoEnCarrito) ? 'Sacar del carrito' : 'Añadir al carrito'}
                        </button>
                    </div>
                </div>
            </div>`;
        });

        //Genero el catalogo en el HTML
        $('#catalogo').html(catalogo);

        //Agrego los evento a los botones
        this.generarEventoAgregarAlCarrito();
        this.generarEventoEliminarDelCarrito();

        //Animación de efecto de carga de cada producto
        Array.from($('#catalogo').children()).forEach((c, index)=>{

            $(`#${index}`).delay(index*200).fadeIn(1000);
        });
    }

    //Método para que una vez estén generadas las cards, se agregue el evento de añadir al carrito
    //a los botones correspondientes
    generarEventoAgregarAlCarrito() {

        Array.from($(".btn-agregar")).forEach(button => {

            button.onclick = (event) => {

                let id = event.target.getAttribute("data-id");
                let producto = this.obtenerProductoPorId(id);
                
                this.agregarProductoAlCarrito(producto);

                //Cuando se hace click y se agrega el producto, el botón cambia de formato para
                //ser un botón que ahora elimina el producto del carrito
                event.target.className = "btn btn-danger btn-eliminar";
                event.target.innerHTML = "Sacar del carrito";

                this.generarEventoEliminarDelCarrito();
            };
        });
    }

    //Método para que una vez estén generadas las cards, se agregue el evento de eliminar del carrito
    //a los botones correspondientes
    generarEventoEliminarDelCarrito() {

        Array.from($(".btn-eliminar")).forEach(button => {
            
            button.onclick = (event) => {
        
                let id = event.target.getAttribute("data-id");
                let producto = this.obtenerProductoPorId(id);
                
                this.eliminarProductoDelCarrito(producto);

                //Cuando se hace click y se elimina el producto, el botón cambia de formato para
                //ser un botón que ahora agrega el producto al carrito
                event.target.className = "btn btn-dark btn-agregar";
                event.target.innerHTML = "Añadir del carrito";

                this.generarEventoAgregarAlCarrito();
            };
        });
    }

    //Método que utilizan los botones para agregar productos al carrito
    agregarProductoAlCarrito(producto) {

        let nuevoProductoCarrito = {
            nombre: producto.nombre,
            precio: producto.precio
        };

        this.carrito.push(nuevoProductoCarrito);  

        localStorage.carrito = JSON.stringify(this.carrito);

        //Notificación al agregar productos al carrito
        $('#alerta').append(
            `<div class="alert alert-success alert-dismissible" role="alert">
                ${producto.nombre} agregado al carrito
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
        );

        let alerta =  $('#alerta div').last();

        //Animación de la alerta
        $('#alerta div').last().fadeIn(250).delay(2000).fadeOut(3000, () =>{
            alerta.remove();
        });
    }

    //Método que utilizan los botones para eliminar productos del carrito
    eliminarProductoDelCarrito(producto) {

        let index = this.carrito.findIndex(p => p.nombre === producto.nombre);

        this.carrito.splice(index, 1);

        localStorage.carrito = JSON.stringify(this.carrito);

        //Notificación al sacar productos del carrito
        $('#alerta').append(
            `<div class="alert alert-danger alert-dismissible" role="alert">
                ${producto.nombre} eliminado del carrito
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
        );

        let alerta =  $('#alerta div').last();

        //Animación de la alerta
        $('#alerta div').last().fadeIn(250).delay(2000).fadeOut(3000, () =>{
            alerta.remove();
        });
    }

    //Método para obtener un producto por su ID
    obtenerProductoPorId(id) {
        return this.productos.find(producto => producto.id == id);
    }
}