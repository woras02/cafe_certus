const PRODUCTOS = [
    {
        id: 1,
        nombre: "Caramel Macchiato",
        descripcion: "Café suave con leche al vapor, jarabe de vainilla y un toque de caramelo.",
        precioBase: 14.50,
        categoria: "bebidas-calientes",
        icono: "fa-solid fa-mug-hot"
    },
    {
        id: 2,
        nombre: "Café Latte",
        descripcion: "Espresso suave con leche al vapor y una capa ligera de espuma.",
        precioBase: 12.00,
        categoria: "bebidas-calientes",
        icono: "fa-solid fa-mug-hot"
    },
    {
        id: 3,
        nombre: "Mocha Blanco",
        descripcion: "Espresso con salsa de chocolate blanco y leche al vapor.",
        precioBase: 15.00,
        categoria: "bebidas-calientes",
        icono: "fa-solid fa-mug-hot"
    },
    {
        id: 4,
        nombre: "Té Chai Latte",
        descripcion: "Té negro especiado mezclado con leche al vapor y un toque de canela.",
        precioBase: 13.00,
        categoria: "bebidas-calientes",
        icono: "fa-solid fa-mug-hot"
    },
    {
        id: 5,
        nombre: "Frappuccino de Vainilla",
        descripcion: "Bebida fría cremosa mezclada con hielo y jarabe de vainilla.",
        precioBase: 16.00,
        categoria: "bebidas-frias",
        icono: "fa-solid fa-snowflake"
    },
    {
        id: 6,
        nombre: "Frappuccino Mocha",
        descripcion: "Café frappé con chocolate, hielo y crema batida.",
        precioBase: 17.00,
        categoria: "bebidas-frias",
        icono: "fa-solid fa-snowflake"
    },
    {
        id: 7,
        nombre: "Matcha Frappuccino",
        descripcion: "Té verde matcha en polvo mezclado con leche, hielo y crema.",
        precioBase: 17.50,
        categoria: "bebidas-frias",
        icono: "fa-solid fa-leaf"
    },
    {
        id: 8,
        nombre: "Limonada Refrescante",
        descripcion: "Limonada natural con hierbabuena y hielo.",
        precioBase: 10.00,
        categoria: "bebidas-frias",
        icono: "fa-solid fa-lemon"
    },
    {
        id: 9,
        nombre: "Croissant de Mantequilla",
        descripcion: "Croissant horneado, hojaldrado y servido tibio.",
        precioBase: 8.50,
        categoria: "reposteria",
        icono: "fa-solid fa-bread-slice"
    },
    {
        id: 10,
        nombre: "Cheesecake de Fresa",
        descripcion: "Tarta cremosa de queso con cobertura de fresas naturales.",
        precioBase: 11.00,
        categoria: "reposteria",
        icono: "fa-solid fa-cake-candles"
    },
    {
        id: 11,
        nombre: "Muffin Arándano",
        descripcion: "Muffin esponjoso relleno de arándanos frescos.",
        precioBase: 7.00,
        categoria: "reposteria",
        icono: "fa-solid fa-cupcake"
    },
    {
        id: 12,
        nombre: "Cookie Triple Chocolate",
        descripcion: "Galleta grande con chispas de chocolate blanco, negro y leche.",
        precioBase: 6.50,
        categoria: "reposteria",
        icono: "fa-solid fa-cookie-bite"
    }
];

const USUARIOS_DEMO = [
    { id: 1, nombre: "Cliente Demo", email: "cliente@starbucks.com", password: "123456", rol: "cliente" },
    { id: 2, nombre: "Admin Demo", email: "admin@starbucks.com", password: "admin123", rol: "admin" }
];
