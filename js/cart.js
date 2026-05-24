(function() {
    const CART_KEY = 'startech_carrito';
    const ORDERS_KEY = 'startech_pedidos';

    function initCart() {
        actualizarBadge();
        renderCarrito();
        configurarSidebar();
        configurarCheckout();
    }

    function getCarrito() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    }

    function guardarCarrito(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        actualizarBadge();
        renderCarrito();
    }

    function actualizarBadge() {
        var badge = document.getElementById('cart-count');
        if (!badge) return;
        var items = getCarrito();
        var total = items.reduce(function(sum, item) { return sum + item.cantidad; }, 0);
        badge.textContent = total;
    }

    window.agregarAlCarrito = function(item) {
        var items = getCarrito();
        var existente = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === item.id && items[i].detalle === item.detalle) {
                existente = items[i];
                break;
            }
        }

        if (existente) {
            existente.cantidad += 1;
        } else {
            items.push(item);
        }

        guardarCarrito(items);
        abrirSidebar();
    };

    function eliminarDelCarrito(index) {
        var items = getCarrito();
        items.splice(index, 1);
        guardarCarrito(items);
    }

    function cambiarCantidad(index, delta) {
        var items = getCarrito();
        if (items[index]) {
            items[index].cantidad += delta;
            if (items[index].cantidad <= 0) {
                items.splice(index, 1);
            }
            guardarCarrito(items);
        }
    }

    function renderCarrito() {
        var container = document.getElementById('cart-items-container');
        var totalSpan = document.getElementById('cart-total-val');
        var btnCheckout = document.getElementById('btn-checkout');
        if (!container) return;

        var items = getCarrito();

        if (items.length === 0) {
            container.innerHTML = '<div class="empty-cart-msg"><i class="fa-solid fa-basket-shopping"></i><p>Tu carrito está vacío.</p><a href="#menu-section" class="btn-secondary btn-sm" id="btn-start-shopping">Elegir un Café</a></div>';
            if (totalSpan) totalSpan.textContent = 'S/. 0.00';
            if (btnCheckout) btnCheckout.disabled = true;
            return;
        }

        var html = '';
        var total = 0;

        items.forEach(function(item, index) {
            var subtotal = item.precio * item.cantidad;
            total += subtotal;
            html += '<div class="cart-item">';
            html += '<div class="cart-item-img"><i class="fa-solid fa-mug-hot"></i></div>';
            html += '<div class="cart-item-info">';
            html += '<h4>' + item.nombre + '</h4>';
            html += '<p>' + item.detalle + '</p>';
            html += '<div class="cart-item-qty">';
            html += '<button class="qty-minus" data-index="' + index + '">-</button>';
            html += '<span>' + item.cantidad + '</span>';
            html += '<button class="qty-plus" data-index="' + index + '">+</button>';
            html += '</div></div>';
            html += '<div class="cart-item-price">';
            html += '<span>S/. ' + subtotal.toFixed(2) + '</span>';
            html += '<br><button class="cart-item-remove" data-index="' + index + '">Eliminar</button>';
            html += '</div></div>';
        });

        container.innerHTML = html;
        if (totalSpan) totalSpan.textContent = 'S/. ' + total.toFixed(2);
        if (btnCheckout) btnCheckout.disabled = false;

        container.querySelectorAll('.qty-minus').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-index'));
                cambiarCantidad(idx, -1);
            });
        });

        container.querySelectorAll('.qty-plus').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-index'));
                cambiarCantidad(idx, 1);
            });
        });

        container.querySelectorAll('.cart-item-remove').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-index'));
                eliminarDelCarrito(idx);
            });
        });
    }

    function configurarSidebar() {
        var toggle = document.getElementById('cart-toggle');
        var sidebar = document.getElementById('cart-sidebar');
        var closeBtn = document.getElementById('close-cart');

        if (toggle && sidebar) {
            toggle.addEventListener('click', function() {
                sidebar.classList.toggle('open');
            });
        }

        if (closeBtn && sidebar) {
            closeBtn.addEventListener('click', function() {
                sidebar.classList.remove('open');
            });
        }
    }

    function abrirSidebar() {
        var sidebar = document.getElementById('cart-sidebar');
        if (sidebar) sidebar.classList.add('open');
    }

    window.abrirSidebar = abrirSidebar;

    function configurarCheckout() {
        var btnCheckout = document.getElementById('btn-checkout');
        if (!btnCheckout) return;

        btnCheckout.addEventListener('click', function() {
            var usuario = typeof window.getUsuarioActual === 'function' ? window.getUsuarioActual() : null;
            if (!usuario) {
                window.location.href = 'login.html';
                return;
            }

            var items = getCarrito();
            if (items.length === 0) return;

            var total = items.reduce(function(sum, item) {
                return sum + (item.precio * item.cantidad);
            }, 0);

            var pedidos = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
            var nuevoId = pedidos.length > 0 ? pedidos[pedidos.length - 1].id + 1 : 1;

            var now = new Date();
            var fecha = now.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            var pedido = {
                id: nuevoId,
                items: JSON.parse(JSON.stringify(items)),
                total: total,
                fecha: fecha,
                clienteEmail: usuario.email,
                clienteNombre: usuario.nombre,
                estado: 'Pendiente'
            };

            pedidos.push(pedido);
            localStorage.setItem(ORDERS_KEY, JSON.stringify(pedidos));
            localStorage.removeItem(CART_KEY);
            actualizarBadge();
            renderCarrito();

            var sidebar = document.getElementById('cart-sidebar');
            if (sidebar) sidebar.classList.remove('open');

            alert('Pedido #' + nuevoId + ' confirmado exitosamente. ¡Gracias por tu compra!');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCart);
    } else {
        initCart();
    }
})();
