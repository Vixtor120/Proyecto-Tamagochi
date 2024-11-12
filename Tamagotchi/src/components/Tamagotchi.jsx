import React from 'react';
import { useState, useEffect } from 'react';

export function Tamagotchi() {
    // Definimos los estados iniciales de hambre, felicidad, salud y dinero
    const [hunger, setHunger] = useState(50);
    const [happiness, setHappiness] = useState(50);
    const [health, setHealth] = useState(100);
    const [money, setMoney] = useState(0);

    // Función para alimentar al Tamagotchi
    const feed = () => {
        if (money >= 10) { // Verifica si hay suficiente dinero
            setHunger((prev) => Math.min(prev + 20, 100)); // Incrementa hambre hasta un máximo de 100
            setHealth((prev) => Math.min(prev + 5, 100)); // Incrementa salud hasta un máximo de 100
            setMoney((prev) => prev - 10); // Decrementa dinero en 10
        } else {
            alert("No tienes suficiente dinero para comprar comida.");
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
        setMoney((prev) => prev + 20); // Incrementa dinero en 20
    };

    useEffect(() => {
        // Creamos un intervalo que reduce los niveles cada 3 segundos
        const timer = setInterval(() => {
            setHunger((prev) => Math.max(prev - 1, 0));
            setHappiness((prev) => Math.max(prev - 1, 0));
            setHealth((prev) => Math.max(prev - 1, 0));
        }, 3000); // Intervalo de 3 segundos
        // Cleanup: Limpia el temporizador cuando el componente se desmonta
        return () => clearInterval(timer);
    }, []); // [] asegura que el efecto solo se ejecute una vez al montar el componente.

    // Función para determinar el color de las barras de progreso
    const getProgressColor = (value) => {
        if (value > 60) return "bg-green-500"; // Verde si el valor es alto
        if (value > 20) return "bg-yellow-500"; //Amarill si el valor es medio
        return "bg-red-500"; // Rojo si el valor es bajo
    };

    // Función para mostrar el mensaje de estado del Tamagotchi
    const getStatusMessage = () => {
        if (hunger < 20) return "😟¡Tengo hambre! 😟";
        if (happiness < 20) return "😢Estoy triste 😢";
        if (health < 20) return "😷No me siento bien 😷";
        return "😊¡Estoy feliz! 😊";
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md w-85">
            <h1 className="text-2xl font-bold text-center mb-4">🐱Tamagotchi🐱</h1>

            <img src="pou-normal.png"></img>

            {/* Mensaje de estado */}
            <p className="text-center text-lg font-semibold mb-4">{getStatusMessage()}</p>

            {/* Barra de Progreso para Hambre */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Hambre:</label>
                <div className="bg-gray-300 h-4 rounded overflow-hidden">
                    {/* Ancho dinámico basado en el valor de hunger*/}
                    <div className={`${getProgressColor(hunger)} h-full`} style={{ width: `${hunger}%` }} />
                </div>
            </div>

            {/* Barra de Progreso para Felicidad */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Felicidad:</label>
                <div className="bg-gray-300 h-4 rounded overflow-hidden">
                    {/* Ancho dinámico basado en el valor de happiness*/}
                    <div className={`${getProgressColor(happiness)} h-full`} style={{ width: `${happiness}%` }} />
                </div>
            </div>

            {/* Barra de Progreso para Salud */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Salud:</label>
                <div className="bg-gray-300 h-4 rounded overflow-hidden">
                    {/* Ancho dinámico basado en el valor de health */}
                    <div className={`${getProgressColor(health)} h-full`} style={{ width: `${health}%` }} />
                </div>
            </div>

            {/* Mostrar el dinero actual */}
            <p className="text-center text-lg font-semibold mb-4">Dinero: ${money}</p>

            {/* Botones de interacción */}
            <div className="flex space-x-2 mt-4">
                {/* Botón para alimentar al Tamagotchi */}
                <button onClick={feed} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">🍬Hambre🍎</button>
                {/* Botón para jugar con el Tamagotchi */}
                <button onClick={play} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">🏈Jugar⚽</button>
                {/* Botón para hacer dormir al Tamagotchi */}
                <button onClick={sleep} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">💤Dormir😴</button>
                {/* Botón para trabajar con el Tamagotchi */}
                <button onClick={work} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">💼Trabajar💼</button>
            </div>
        </div>
    );
}