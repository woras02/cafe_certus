(function() {
    var productos = window.PRODUCTOS || [];

    function initMenu() {
        cargarMenu('todos');
        configurarFiltros();
        configurarBusqueda();
        configurarPersonalizador();
    }

    function cargarMenu(categoria) {
        var grid = document.getElementById('products-grid');
        if (!grid) return;
        grid.innerHTML = '<div class="loader">Cargando menú...</div>';

        var filtrados = categoria === 'todos' ? productos : productos.filter(function(p) { return p.categoria === categoria; });

        if (filtrados.length === 0) {
            grid.innerHTML = '<div class="loader">No se encontraron productos en esta categoría.</div>';
            return;
        }

        var html = '';
        filtrados.forEach(function(p) {
            html += '<div class="product-card" data-id="' + p.id + '">';
            html += '<div class="product-card-img"><i class="' + p.icono + '"></i></div>';
            html += '<h3>' + p.nombre + '</h3>';
            html += '<p class="product-desc">' + p.descripcion + '</p>';
            html += '<span class="product-price">S/. ' + p.precioBase.toFixed(2) + '</span>';
            html += '<button class="btn-add-cart" data-id="' + p.id + '">Agregar al Carrito</button>';
            html += '</div>';
        });

        grid.innerHTML = html;

        grid.querySelectorAll('.btn-add-cart').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(this.getAttribute('data-id'));
                abrirPersonalizador(id);
            });
        });
    }

    function configurarFiltros() {
        var btns = document.querySelectorAll('.category-btn');
        btns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                btns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                var categoria = this.getAttribute('data-category');
                cargarMenu(categoria);
            });
        });
    }

    function configurarBusqueda() {
        var input = document.getElementById('product-search');
        if (!input) return;

        input.addEventListener('input', function() {
            var texto = this.value.toLowerCase().trim();
            var cards = document.querySelectorAll('.product-card');

            cards.forEach(function(card) {
                var nombre = card.querySelector('h3').textContent.toLowerCase();
                var desc = card.querySelector('.product-desc').textContent.toLowerCase();
                if (nombre.indexOf(texto) > -1 || desc.indexOf(texto) > -1) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    function abrirPersonalizador(id) {
        var producto = productos.find(function(p) { return p.id === id; });
        if (!producto) return;

        document.getElementById('modal-product-id').value = producto.id;
        document.getElementById('modal-product-name').textContent = producto.nombre;
        document.getElementById('modal-product-desc').textContent = producto.descripcion;
        document.getElementById('modal-calculated-price').textContent = 'S/. ' + producto.precioBase.toFixed(2);

        document.querySelector('input[name="size"][value="alto"]').checked = true;
        document.getElementById('select-milk').value = 'entera';
        document.querySelectorAll('input[name="toppings"]').forEach(function(cb) { cb.checked = false; });

        document.getElementById('customize-modal').classList.add('open');
        window.productoActualPersonalizar = producto;
    }

    function configurarPersonalizador() {
        var form = document.getElementById('customizer-form');
        if (!form) return;

        function recalcularPrecio() {
            var producto = window.productoActualPersonalizar;
            if (!producto) return;

            var precio = producto.precioBase;
            var sizeSelected = document.querySelector('input[name="size"]:checked');
            if (sizeSelected) {
                precio += parseFloat(sizeSelected.getAttribute('data-add-price')) || 0;
            }

            var milkSelect = document.getElementById('select-milk');
            if (milkSelect) {
                var milkOption = milkSelect.options[milkSelect.selectedIndex];
                precio += parseFloat(milkOption.getAttribute('data-add-price')) || 0;
            }

            document.querySelectorAll('input[name="toppings"]:checked').forEach(function(cb) {
                precio += parseFloat(cb.getAttribute('data-add-price')) || 0;
            });

            document.getElementById('modal-calculated-price').textContent = 'S/. ' + precio.toFixed(2);
        }

        form.querySelectorAll('input[name="size"]').forEach(function(input) {
            input.addEventListener('change', recalcularPrecio);
        });

        document.getElementById('select-milk').addEventListener('change', recalcularPrecio);

        form.querySelectorAll('input[name="toppings"]').forEach(function(input) {
            input.addEventListener('change', recalcularPrecio);
        });

        var closeBtn = document.getElementById('close-customize');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                document.getElementById('customize-modal').classList.remove('open');
            });
        }

        var modal = document.getElementById('customize-modal');
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.remove('open');
        });

        var addBtn = document.getElementById('btn-add-to-cart-confirm');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                var producto = window.productoActualPersonalizar;
                if (!producto) return;

                var sizeSelected = document.querySelector('input[name="size"]:checked');
                var sizeText = sizeSelected ? sizeSelected.value : 'Alto';
                var milkSelect = document.getElementById('select-milk');
                var milkText = milkSelect.options[milkSelect.selectedIndex].text;

                var toppings = [];
                document.querySelectorAll('input[name="toppings"]:checked').forEach(function(cb) {
                    toppings.push(cb.parentElement.querySelector('span:last-child').textContent);
                });

                var precioTotal = parseFloat(document.getElementById('modal-calculated-price').textContent.replace('S/. ', ''));

                var detalle = sizeText + ' | ' + milkText;
                if (toppings.length > 0) detalle += ' | ' + toppings.join(', ');

                var item = {
                    id: producto.id,
                    nombre: producto.nombre,
                    detalle: detalle,
                    precio: precioTotal,
                    cantidad: 1
                };

                if (typeof window.agregarAlCarrito === 'function') {
                    window.agregarAlCarrito(item);
                }

                document.getElementById('customize-modal').classList.remove('open');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }
})();
