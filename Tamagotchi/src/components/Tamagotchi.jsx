import React, { useState, useEffect } from 'react';
import './Tamagotchi.css'; // Importar el archivo CSS para la animación
import pouAlegre from './pou-alegre.png'; // Importar la imagen del Tamagotchi alegre
import pouTriste from './pou-triste.png'; // Importar la imagen del Tamagotchi triste
import pouEnfermo from './pou-enfermo.png'; // Importar la imagen del Tamagotchi enfermo
import pouHambriento from './pou-hambriento.png'; // Importar la imagen del Tamagotchi hambriento


export function Tamagotchi() {
    // Definimos los estados iniciales de hambre, felicidad, salud, dinero y higiene
    const [hunger, setHunger] = useState(50);
    const [happiness, setHappiness] = useState(75);
    const [health, setHealth] = useState(100);
    const [money, setMoney] = useState(0);
    const [hygiene, setHygiene] = useState(100); // Estado para la higiene
    const [showModal, setShowModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar si el juego está en marcha

    // Función para cerrar el modal
    const handleClose = () => setShowModal(false);
    // Función para mostrar el modal
    const handleShow = () => setShowModal(true);

    // Función para alimentar al Tamagotchi
    const feed = () => {
        if (money >= 10) { // Verifica si hay suficiente dinero
            setHunger((prev) => Math.min(prev + 20, 100)); // Incrementa hambre hasta un máximo de 100
            setHealth((prev) => Math.min(prev + 5, 100)); // Incrementa salud hasta un máximo de 100
            setMoney((prev) => prev - 20); // Decrementa dinero en 10
        } else {
            handleShow(); // Muestra el modal si no hay suficiente dinero
        }
    };

    // Función para jugar con el Tamagotchi
    const play = () => {
        setHappiness((prev) => Math.min(prev + 20, 100)); // Incrementa felicidad hasta un máximo de 100
        setHunger((prev) => Math.max(prev - 5, 0)); // Reduce hambre hasta un mínimo de 0
        setHealth((prev) => Math.max(prev - 5, 0)); // Reduce salud hasta un mínimo de 0
    };

    // Función para hacer dormir al Tamagotchi
    const sleep = () => {
        setHealth((prev) => Math.min(prev + 10, 100)); // Incrementa salud hasta un máximo de 100
        setHappiness((prev) => Math.max(prev - 5, 0)); // Reduce felicidad hasta un mínimo de 0
    };

    // Función para trabajar con el Tamagotchi
    const work = () => {
        setHappiness((prev) => Math.max(prev - 10, 0)); // Reduce felicidad hasta un mínimo de 0
        setHealth((prev) => Math.max(prev - 10, 0)); // Reduce salud hasta un mínimo de 0
        setHunger((prev) => Math.max(prev - 10, 0)); // Reduce hambre hasta un mínimo de 0
        setMoney((prev) => prev + 20); // Incrementa dinero en 25
    };

    // Función para iniciar/pausar el juego
    const togglePlayPause = () => {
        if (!isPlaying) {
            // Iniciar el juego con hambre a 50 y felicidad a 75
            setHunger(50);
            setHappiness(75);
            setHealth(100);
            setMoney(0);
            setHygiene(100); // Iniciar el juego con higiene a 100
        }
        setIsPlaying((prev) => !prev);
    };

    useEffect(() => {
        if (!isPlaying) return; // Si no estamos jugando, no hacemos nada

        // Creamos un intervalo que reduce los niveles cada 3 segundos
        const timer = setInterval(() => {
            setHunger((prev) => Math.max(prev - 1, 0));
            setHappiness((prev) => Math.max(prev - 1, 0));
            setHealth((prev) => Math.max(prev - 1, 0));
            setHygiene((prev) => Math.max(prev - 1, 0)); // Reducir higiene cada 3 segundos
        }, 3000); // Intervalo de 3 segundos

        // Cleanup: Limpia el temporizador cuando el componente se desmonta o se pausa el juego
        return () => clearInterval(timer);
    }, [isPlaying]); // Dependencia en isPlaying para iniciar/pausar el juego

    // Función para determinar el color de las barras de progreso y agregar clase de animación si es rojo
    const getProgressClass = (value) => {
        let colorClass = "";
        if (value > 60) colorClass = "bg-green-500";
        else if (value > 20) colorClass = "bg-yellow-500";
        else colorClass = "bg-red-500 heartbeat"; // Agregar clase de animación si es rojo
        return colorClass;
    };

    // Función para mostrar el mensaje de estado del Tamagotchi
    const getStatusMessage = () => {
        if (hunger < 20 && happiness < 20 && health < 20) return "¡Tengo hambre, estoy triste y no me siento bien! 😟😢😷";
        if (hunger < 20 && happiness < 20) return "¡Tengo hambre y estoy triste! 😟😢";
        if (hunger < 20 && health < 20) return "¡Tengo hambre y no me siento bien! 😟😷";
        if (happiness < 20 && health < 20) return "¡Estoy triste y no me siento bien! 😢😷";
        if (hunger < 20) return "¡Tengo hambre! 😟";
        if (happiness < 20) return "Estoy triste 😢";
        if (health < 20) return "No me siento bien 😷";
        return "¡Estoy feliz! 😊";
    };

    // Determinar la imagen del Tamagotchi basada en su estado
    const getTamagotchiImage = () => {
        if (hunger < 20) return pouHambriento;
        if (health < 20) return pouEnfermo;
        if (happiness < 20) return pouTriste;
        return pouAlegre;
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md w-85">
            <h1 className="text-2xl font-bold text-center mb-4">🐱Tamagotchi🐱</h1>

            {/* Imagen del Tamagotchi */}
            <div className="flex justify-center mb-4">
                <img src={getTamagotchiImage()} alt="Tamagotchi" className="tamagotchi-image" />
            </div>

            {/* Mensaje de estado */}
            <p className="text-center text-lg font-semibold mb-4">{getStatusMessage()}</p>

            {/* Barra de Progreso para Hambre */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Hambre:</label>
                <div className="bg-gray-300 h-4 rounded overflow-hidden">
                    {/* Ancho dinámico basado en el valor de hunger */}
                    <div className={`${getProgressClass(hunger)} h-full`} style={{ width: `${hunger}%` }} />
                </div>
            </div>

            {/* Barra de Progreso para Felicidad */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Felicidad:</label>
                <div className="bg-gray-300 h-4 rounded overflow-hidden">
                    {/* Ancho dinámico basado en el valor de happiness */}
                    <div className={`${getProgressClass(happiness)} h-full`} style={{ width: `${happiness}%` }} />
                </div>
            </div>

            {/* Barra de Progreso para Salud */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Salud:</label>
                <div className="bg-gray-300 h-4 rounded overflow-hidden">
                    {/* Ancho dinámico basado en el valor de health */}
                    <div className={`${getProgressClass(health)} h-full`} style={{ width: `${health}%` }} />
                </div>
            </div>

            {/* Mostrar el dinero actual */}
            <p className="text-center text-lg font-semibold mb-4">Dinero: ${money}</p>

            {/* Botones de interacción */}
            <div className="flex space-x-2 mt-4">
                {/* Botón para alimentar al Tamagotchi */}
                <button
                    onClick={feed}
                    className={`px-4 py-2 ${isPlaying ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500'} text-white rounded transition`}
                    disabled={!isPlaying}
                >
                    🍬Hambre🍎
                </button>
                {/* Botón para jugar con el Tamagotchi */}
                <button
                    onClick={play}
                    className={`px-4 py-2 ${isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} text-white rounded transition`}
                    disabled={!isPlaying}
                >
                    🏈Jugar⚽
                </button>
                {/* Botón para hacer dormir al Tamagotchi */}
                <button
                    onClick={sleep}
                    className={`px-4 py-2 ${isPlaying ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-500'} text-white rounded transition`}
                    disabled={!isPlaying}
                >
                    💤Dormir😴
                </button>
                {/* Botón para trabajar con el Tamagotchi */}
                <button
                    onClick={work}
                    className={`px-4 py-2 ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500'} text-white rounded transition`}
                    disabled={!isPlaying}
                >
                    💼Trabajar💼
                </button>
            </div>
            {/* Botón para iniciar/pausar el juego */}
            <div className="flex justify-center mt-4">
                <button onClick={togglePlayPause} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                    {isPlaying ? '⏸️ Pausar' : '▶️ Iniciar'}
                </button>
            </div>

            {/* Modal para fondos insuficientes */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Fondos Insuficientes</h2>
                        <p>No tienes suficiente dinero para comprar comida.</p>
                        <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={handleClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}