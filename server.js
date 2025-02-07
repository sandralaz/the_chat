require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const User = require('./models/User'); // Asegúrate de que tienes el modelo User correctamente definido
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json()); // Para parsear cuerpos de peticiones en JSON
app.use(express.static('public')); // Servir archivos estáticos desde 'public'

// Ruta para redirigir a la página de login
app.get('/', (req, res) => {
    res.redirect('/login.html');  // Redirige a login.html por defecto
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error de conexión:", err));

// Ruta de registro (ahora sin hashing)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar si ya existe el usuario
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear el nuevo usuario sin hashear la contraseña
        const newUser = new User({
            username,
            password, // Almacena la contraseña tal cual la recibe
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
});

// Ruta de login (sin hash)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Datos recibidos en el servidor:', { username, password }); // Verifica lo que está enviando el cliente

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la almacenada en texto claro
        console.log('Contraseña ingresada:', password); // Verifica lo que se ingresa
        console.log('Contraseña almacenada:', user.password); // Verifica la contraseña almacenada

        if (user.password !== password) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesión', error });
    }
});

// Gestión de conexiones de sockets
let listaUsuarios = {};
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado:', socket.id);
    listaUsuarios[socket.id] = `Usuario-${socket.id.substring(0, 4)}`;
    io.emit('update user list', listaUsuarios);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('private message', ({ destinatario, message }) => {
        io.to(destinatario).emit('private message', { emisor: listaUsuarios[socket.id], message });
    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado:', socket.id);
        delete listaUsuarios[socket.id];
        io.emit('update user list', listaUsuarios);
    });
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

