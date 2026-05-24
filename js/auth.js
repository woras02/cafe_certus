(function() {
    const STORAGE_KEY = 'startech_usuario';
    const USERS_KEY = 'startech_usuarios';

    function initAuth() {
        cargarUsuariosGuardados();
        actualizarUI();

        const formLogin = document.getElementById('form-login');
        const formRegister = document.getElementById('form-register');
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');

        if (formLogin) {
            formLogin.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value.trim();
                const resultado = iniciarSesion(email, password);
                mostrarAlerta(resultado.ok ? resultado.mensaje : resultado.error, resultado.ok ? 'success' : 'error');
                if (resultado.ok) {
                    setTimeout(function() { window.location.href = 'index.html'; }, 800);
                }
            });
        }

        if (formRegister) {
            formRegister.addEventListener('submit', function(e) {
                e.preventDefault();
                const nombre = document.getElementById('reg-name').value.trim();
                const email = document.getElementById('reg-email').value.trim();
                const password = document.getElementById('reg-password').value.trim();
                const rol = document.getElementById('reg-role').value;

                if (!nombre || !email || password.length < 6) {
                    mostrarAlerta('Completa todos los campos y usa mínimo 6 caracteres para la contraseña.', 'error');
                    return;
                }

                const resultado = registrarUsuario(nombre, email, password, rol);
                mostrarAlerta(resultado.ok ? resultado.mensaje : resultado.error, resultado.ok ? 'success' : 'error');
                if (resultado.ok) {
                    document.getElementById('form-register').reset();
                    document.getElementById('tab-login').click();
                }
            });
        }

        if (tabLogin && tabRegister) {
            tabLogin.addEventListener('click', function() {
                tabLogin.classList.add('active');
                tabRegister.classList.remove('active');
                document.getElementById('form-login').classList.remove('d-none');
                document.getElementById('form-register').classList.add('d-none');
                document.getElementById('auth-alert').classList.add('d-none');
            });

            tabRegister.addEventListener('click', function() {
                tabRegister.classList.add('active');
                tabLogin.classList.remove('active');
                document.getElementById('form-register').classList.remove('d-none');
                document.getElementById('form-login').classList.add('d-none');
                document.getElementById('auth-alert').classList.add('d-none');
            });
        }

        const btnHistorial = document.getElementById('btn-historial');
        if (btnHistorial) {
            btnHistorial.addEventListener('click', function(e) {
                e.preventDefault();
                const usuario = getUsuarioActual();
                if (!usuario) {
                    window.location.href = 'login.html';
                } else {
                    abrirModalOrdenes();
                }
            });
        }
    }

    function cargarUsuariosGuardados() {
        if (!localStorage.getItem(USERS_KEY)) {
            localStorage.setItem(USERS_KEY, JSON.stringify(USUARIOS_DEMO));
        }
    }

    function getUsuarios() {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    }

    function guardarUsuarios(usuarios) {
        localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
    }

    function iniciarSesion(email, password) {
        const usuarios = getUsuarios();
        const usuario = usuarios.find(function(u) { return u.email === email && u.password === password; });
        if (usuario) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
            actualizarUI();
            return { ok: true, mensaje: 'Inicio de sesión exitoso. Bienvenido ' + usuario.nombre + '!' };
        }
        return { ok: false, error: 'Credenciales incorrectas. Revisa tu correo y contraseña.' };
    }

    function registrarUsuario(nombre, email, password, rol) {
        const usuarios = getUsuarios();
        var existe = usuarios.some(function(u) { return u.email === email; });
        if (existe) {
            return { ok: false, error: 'El correo ya está registrado. Usa otro o inicia sesión.' };
        }
        var nuevoId = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;
        var nuevo = { id: nuevoId, nombre: nombre, email: email, password: password, rol: rol };
        usuarios.push(nuevo);
        guardarUsuarios(usuarios);
        return { ok: true, mensaje: 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.' };
    }

    function cerrarSesion() {
        localStorage.removeItem(STORAGE_KEY);
        actualizarUI();
        window.location.href = 'index.html';
    }

    function getUsuarioActual() {
        var data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    function actualizarUI() {
        var usuario = getUsuarioActual();
        var userInfo = document.getElementById('user-info');
        var linkAdmin = document.getElementById('link-admin');

        if (!userInfo) return;

        if (usuario) {
            userInfo.innerHTML = '<span class="user-greeting"><i class="fa-solid fa-circle-check" style="color: #006241;"></i> ' + usuario.nombre + ' (' + usuario.rol + ')</span> <button id="btn-logout" class="btn-logout">Cerrar Sesión</button>';
            var btnLogout = document.getElementById('btn-logout');
            if (btnLogout) {
                btnLogout.addEventListener('click', cerrarSesion);
            }

            if (linkAdmin) {
                if (usuario.rol === 'admin') {
                    linkAdmin.classList.remove('d-none');
                } else {
                    linkAdmin.classList.add('d-none');
                }
            }
        } else {
            userInfo.innerHTML = '<a href="login.html" class="btn-login"><i class="fa-solid fa-user"></i> Iniciar Sesión</a>';
            if (linkAdmin) linkAdmin.classList.add('d-none');
        }
    }

    function mostrarAlerta(mensaje, tipo) {
        var alerta = document.getElementById('auth-alert');
        if (!alerta) return;
        alerta.classList.remove('d-none', 'error', 'success');
        alerta.classList.add(tipo);
        alerta.textContent = mensaje;
    }

    function abrirModalOrdenes() {
        var modal = document.getElementById('orders-modal');
        var lista = document.getElementById('orders-list');
        if (!modal || !lista) return;

        var pedidos = JSON.parse(localStorage.getItem('startech_pedidos')) || [];
        var usuario = getUsuarioActual();

        if (pedidos.length === 0) {
            lista.innerHTML = '<div class="empty-cart-msg"><p>No tienes pedidos aún.</p></div>';
        } else {
            var html = '';
            var pedidosFiltrados = pedidos.filter(function(p) { return p.clienteEmail === usuario.email; });
            if (pedidosFiltrados.length === 0) {
                lista.innerHTML = '<div class="empty-cart-msg"><p>No tienes pedidos aún.</p></div>';
            } else {
                pedidosFiltrados.forEach(function(p) {
                    html += '<div class="order-item">';
                    html += '<h4>Orden #' + p.id + '</h4>';
                    html += '<p>' + p.fecha + '</p>';
                    html += '<p class="order-total">Total: S/. ' + p.total.toFixed(2) + '</p>';
                    html += '<p class="order-status">' + p.estado + '</p>';
                    html += '</div>';
                });
                lista.innerHTML = html;
            }
        }

        modal.classList.add('open');

        var closeBtn = document.getElementById('close-orders');
        if (closeBtn) {
            closeBtn.onclick = function() { modal.classList.remove('open'); };
        }

        modal.onclick = function(e) {
            if (e.target === modal) modal.classList.remove('open');
        };
    }

    window.getUsuarioActual = getUsuarioActual;
    window.cerrarSesion = cerrarSesion;
    window.abrirModalOrdenes = abrirModalOrdenes;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
})();
