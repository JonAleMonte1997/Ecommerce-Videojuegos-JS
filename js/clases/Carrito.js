class Carrito{

    constructor() {

        this.carrito = (localStorage.carrito) ? JSON.parse(localStorage.carrito) : [];
    }

    //Método que genera la tabla con los datos del carrito que vienen del localStorage
    generarCarrito() {

        let carrito = '';

        //Si no existen productos en el carrito, genero un mensaje por defecto
        if (!this.carrito.length) {
            carrito += `
            <tr>
                <td>No hay productos en el carrito</td>
                <td></td>
                <td></td>
            </tr>`;

            $('#btn-confirmar').prop('disabled', true);
        } else {
            this.carrito.forEach((producto, index) => {
                carrito += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio}</td>
                    <td><button class="btn btn-close btn-eliminar" data-index="${index}"></button></td>
                </tr>`;
            })

            $('#btn-confirmar').prop('disabled', false)
        }

        $('#carrito').html(carrito);

        //Tras generar el carrito, agrego los eventos para eliminar productos del carrito a cada botón
        //correspondiente y calculo el total para mostrarlo en la página
        this.generarEventoEliminarDelCarrito();
        this.generarTotal();
    }

    //Método para generar el evento de eliminar productos a los botones correspondientes
    generarEventoEliminarDelCarrito() {

        Array.from($(".btn-eliminar")).forEach(button => {

            button.addEventListener('click', (event) => {

                let index = event.target.getAttribute("data-index");
                
                this.eliminarDelCarrito(index);
            })
        });
    }

    //Método para calcular el total de los productos del carrito
    generarTotal() {

        let total = 0;

        this.carrito.forEach(producto => {
            total += producto.precio;
        })

        $('#total').html(`$${total}`);
    }

    //Método que utilizan los botones que eliminan los productos del carrito
    eliminarDelCarrito(index){

        this.carrito.splice(Number(index), 1);

        localStorage.carrito = JSON.stringify(this.carrito);

        this.generarCarrito();
    }

    //Método para confirmar la compra y mandar los datos del pedido a MercadoPago u otra plataforma
    //para realizar el pago
    confirmarVenta() {

        console.log(this.carrito);
    }
}