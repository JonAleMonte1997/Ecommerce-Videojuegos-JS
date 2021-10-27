let carrito = new Carrito();

carrito.generarCarrito();

$('#btn-confirmar').click(() => {
    carrito.confirmarVenta();
});