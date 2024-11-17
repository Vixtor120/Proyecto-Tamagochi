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
    const [energy, setEnergy] = useState(100); // Estado para la energía
    const [showModal, setShowModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar si el juego está en marcha
    const [inventory, setInventory] = useState({
        specialFood: 0,
        toy: 0,
        toothbrush: 0,
        energizer: 0,
    });
    const [isGameOver, setIsGameOver] = useState(false); // Estado para controlar si el juego ha terminado
    const [level, setLevel] = useState(1); // Estado para el nivel del Tamagotchi
    const [timeWithoutCritical, setTimeWithoutCritical] = useState(0); // Estado para el tiempo sin niveles críticos
    const [workCount, setWorkCount] = useState(0); // Estado para contar las veces que se ha trabajado consecutivamente
    const [showExploitationModal, setShowExploitationModal] = useState(false); // Estado para mostrar el modal de explotación
    const [showFineModal, setShowFineModal] = useState(false); // Estado para mostrar el modal de multa
    const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false); // Estado para mostrar el modal de fondos insuficientes
    const [canWork, setCanWork] = useState(true); // Estado para controlar si se puede trabajar

    // Función para cerrar el modal
    const handleClose = () => setShowModal(false);
    // Función para mostrar el modal
    const handleShow = () => setShowModal(true);
    // Función para cerrar el modal de explotación
    const handleCloseExploitationModal = () => setShowExploitationModal(false);
    // Función para cerrar el modal de multa
    const handleCloseFineModal = () => setShowFineModal(false);
    // Función para cerrar el modal de fondos insuficientes
    const handleCloseInsufficientFundsModal = () => setShowInsufficientFundsModal(false);

    // Función para pagar la multa
    const payFine = () => {
        setMoney(0); // Decrementa todo el dinero
        setWorkCount(0); // Reiniciar el contador de trabajo
        setShowFineModal(false); // Cerrar el modal de multa
        setCanWork(true); // Permitir trabajar nuevamente
    };

    // Función para no pagar la multa
    const doNotPayFine = () => {
        setShowFineModal(false); // Cerrar el modal de multa
        setCanWork(false); // Deshabilitar la opción de trabajar
    };

    // Función para alimentar al Tamagotchi
    const feed = () => {
        if (money >= 10) { // Verifica si hay suficiente dinero
            setHunger((prev) => Math.min(prev + 20, 100)); // Incrementa hambre hasta un máximo de 100
            setHealth((prev) => Math.min(prev + 5, 100)); // Incrementa salud hasta un máximo de 100
            setMoney((prev) => Math.max(prev - 20, 0)); // Decrementa dinero en 10, asegurando que no sea negativo
        } else {
            setShowInsufficientFundsModal(true); // Muestra el modal si no hay suficiente dinero
        }
    };

    // Función para jugar con el Tamagotchi
    const play = () => {
        setHappiness((prev) => Math.min(prev + 20, 100)); // Incrementa felicidad hasta un máximo de 100
        setHunger((prev) => Math.max(prev - 5, 0)); // Reduce hambre hasta un mínimo de 0
        setHealth((prev) => Math.max(prev - 5, 0)); // Reduce salud hasta un mínimo de 0
        setEnergy((prev) => Math.max(prev - 10, 0)); // Reduce energía hasta un mínimo de 0
    };

    // Función para hacer dormir al Tamagotchi
    const sleep = () => {
        setHealth((prev) => Math.min(prev + 10, 100)); // Incrementa salud hasta un máximo de 100
        setHappiness((prev) => Math.max(prev - 5, 0)); // Reduce felicidad hasta un mínimo de 0
        setEnergy((prev) => Math.min(prev + 20, 100)); // Incrementa energía hasta un máximo de 100
    };

    // Función para trabajar con el Tamagotchi
    const work = () => {
        if (workCount >= 3) {
            setShowFineModal(true);
            return;
        }
        setHappiness((prev) => Math.max(prev - 10, 0)); // Reduce felicidad hasta un mínimo de 0
        setHealth((prev) => Math.max(prev - 10, 0)); // Reduce salud hasta un mínimo de 0
        setHunger((prev) => Math.max(prev - 10, 0)); // Reduce hambre hasta un mínimo de 0
        setEnergy((prev) => Math.max(prev - 20, 0)); // Reduce energía hasta un mínimo de 0
        setHygiene((prev) => Math.max(prev - 10, 0)); // Reduce higiene hasta un mínimo de 0
        setMoney((prev) => prev + 20); // Incrementa dinero en 20
        setWorkCount((prev) => prev + 1); // Incrementa el contador de trabajo
    };

    // Función para limpiar al Tamagotchi
    const clean = () => {
        setHygiene((prev) => Math.min(prev + 20, 100)); // Incrementa higiene hasta un máximo de 100
        setHappiness((prev) => Math.min(prev + 5, 100)); // Incrementa felicidad hasta un máximo de 100
        setEnergy((prev) => Math.max(prev - 10, 0)); // Reduce energía hasta un mínimo de 0
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
            setWorkCount(0); // Reiniciar el contador de trabajo
        }
        setIsPlaying((prev) => !prev);
    };

    // Función para canjear puntos por objetos
    const redeemItem = (item) => {
        if (money >= 50) { // Verifica si hay suficiente dinero
            setMoney((prev) => Math.max(prev - 50, 0)); // Decrementa dinero en 50, asegurando que no sea negativo
            setInventory((prev) => ({
                ...prev,
                [item]: prev[item] + 1,
            }));
        } else {
            setShowInsufficientFundsModal(true); // Muestra el modal si no hay suficiente dinero
        }
    };

    // Función para usar un objeto del inventario
    const useItem = (item) => {
        if (inventory[item] > 0) {
            setInventory((prev) => ({
                ...prev,
                [item]: prev[item] - 1,
            }));
            switch (item) {
                case 'specialFood':
                    setHunger((prev) => Math.min(prev + 50, 100));
                    break;
                case 'toy':
                    setHappiness((prev) => Math.min(prev + 50, 100));
                    break;
                case 'toothbrush':
                    setHygiene((prev) => Math.min(prev + 50, 100));
                    break;
                case 'energizer':
                    setEnergy((prev) => Math.min(prev + 50, 100));
                    break;
                default:
                    break;
            }
        }
    };

    // Función para reiniciar el juego
    const restartGame = () => {
        setHunger(50);
        setHappiness(75);
        setHealth(100);
        setMoney(0);
        setHygiene(100);
        setEnergy(100);
        setIsPlaying(false);
        setIsGameOver(false);
        setLevel(1);
        setTimeWithoutCritical(0);
        setWorkCount(0); // Reiniciar el contador de trabajo
    };

    useEffect(() => {
        if (!isPlaying) return; // Si no estamos jugando, no hacemos nada
    
        // Creamos un intervalo que reduce los niveles cada 4 segundos
        const timer = setInterval(() => {
            setHunger((prev) => Math.max(prev - level, 0));
            setHappiness((prev) => Math.max(prev - level, 0));
            setHealth((prev) => Math.max(prev - level, 0));
            setHygiene((prev) => Math.max(prev - level, 0)); // Reducir higiene cada 4 segundos
            setEnergy((prev) => Math.max(prev - level, 0)); // Reducir energía cada 4 segundos
    
            // Incrementar dinero si ninguna barra está en niveles críticos
            if (hunger > 20 && happiness > 20 && health > 20 && hygiene > 20 && energy > 20) {
                setMoney((prev) => prev + 3); // Incrementa dinero en 3
                setTimeWithoutCritical((prev) => prev + 4); // Incrementar tiempo sin niveles críticos
            } else {
                setTimeWithoutCritical(0); // Reiniciar tiempo sin niveles críticos si alguna barra está en niveles críticos
            }
    
            // Verificar si alguna barra ha llegado a cero
            if (hunger === 0 || happiness === 0 || health === 0 || hygiene === 0 || energy === 0) {
                setIsGameOver(true);
                setIsPlaying(false);
                clearInterval(timer);
            }
    
            // Subir de nivel cada 60 segundos sin niveles críticos
            if (timeWithoutCritical >= 60) {
                setLevel((prev) => prev + 1);
                setTimeWithoutCritical(0);
            }
        }, 4000); // Intervalo de 4 segundos
    
        // Cleanup: Limpia el temporizador cuando el componente se desmonta o se pausa el juego
        return () => clearInterval(timer);
    }, [isPlaying, hunger, happiness, health, hygiene, energy, level, timeWithoutCritical]); // Dependencia en isPlaying para iniciar/pausar el juego

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
        if (hunger < 20 && happiness < 20 && health < 20 && hygiene < 20 && energy < 20) return "¡Tengo hambre, estoy triste, no me siento bien, estoy sucio y cansado! 😟😢😷🛁😴";
        if (hunger < 20 && happiness < 20 && health < 20 && hygiene < 20) return "¡Tengo hambre, estoy triste, no me siento bien y estoy sucio! 😟😢😷🛁";
        if (hunger < 20 && happiness < 20 && health < 20 && energy < 20) return "¡Tengo hambre, estoy triste, no me siento bien y estoy cansado! 😟😢😷😴";
        if (hunger < 20 && happiness < 20 && hygiene < 20 && energy < 20) return "¡Tengo hambre, estoy triste, estoy sucio y cansado! 😟😢🛁😴";
        if (hunger < 20 && health < 20 && hygiene < 20 && energy < 20) return "¡Tengo hambre, no me siento bien, estoy sucio y cansado! 😟😷🛁😴";
        if (happiness < 20 && health < 20 && hygiene < 20 && energy < 20) return "¡Estoy triste, no me siento bien, estoy sucio y cansado! 😢😷🛁😴";
        if (hunger < 20 && happiness < 20 && health < 20) return "¡Tengo hambre, estoy triste y no me siento bien! 😟😢😷";
        if (hunger < 20 && happiness < 20) return "¡Tengo hambre y estoy triste! 😟😢";
        if (hunger < 20 && health < 20) return "¡Tengo hambre y no me siento bien! 😟😷";
        if (happiness < 20 && health < 20) return "¡Estoy triste y no me siento bien! 😢😷";
        if (hunger < 20 && hygiene < 20) return "¡Tengo hambre y estoy sucio! 😟🛁";
        if (hunger < 20 && energy < 20) return "¡Tengo hambre y estoy cansado! 😟😴";
        if (happiness < 20 && hygiene < 20) return "¡Estoy triste y estoy sucio! 😢🛁";
        if (happiness < 20 && energy < 20) return "¡Estoy triste y estoy cansado! 😢😴";
        if (health < 20 && hygiene < 20) return "¡No me siento bien y estoy sucio! 😷🛁";
        if (health < 20 && energy < 20) return "¡No me siento bien y estoy cansado! 😷😴";
        if (hygiene < 20 && energy < 20) return "¡Estoy sucio y estoy cansado! 🛁😴";
        if (hunger < 20) return "¡Tengo hambre! 😟";
        if (happiness < 20) return "Estoy triste 😢";
        if (health < 20) return "No me siento bien 😷";
        if (hygiene < 20) return "Estoy sucio 🛁";
        if (energy < 20) return "Estoy cansado 😴";
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

            {/* Mostrar el nivel actual */}
            <p className="text-center text-lg font-semibold mb-4">Nivel: {level}</p>

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

            {/* Barra de Progreso para Higiene */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Higiene:</label>
                <div className="bg-gray-300 h-4 rounded overflow-hidden">
                    {/* Ancho dinámico basado en el valor de hygiene */}
                    <div className={`${getProgressClass(hygiene)} h-full`} style={{ width: `${hygiene}%` }} />
                </div>
            </div>

            {/* Barra de Progreso para Energía */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Energía:</label>
                <div className="bg-gray-300 h-4 rounded overflow-hidden">
                    {/* Ancho dinámico basado en el valor de energy */}
                    <div className={`${getProgressClass(energy)} h-full`} style={{ width: `${energy}%` }} />
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
                    className={`px-4 py-2 ${isPlaying && canWork ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500'} text-white rounded transition`}
                    disabled={!isPlaying || !canWork}
                >
                    💼Trabajar💼
                </button>
                {/* Botón para limpiar al Tamagotchi */}
                <button
                    onClick={clean}
                    className={`px-4 py-2 ${isPlaying ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-500'} text-white rounded transition`}
                    disabled={!isPlaying}
                >
                    🛁Limpiar🧼
                </button>
            </div>
            {/* Botón para iniciar/pausar el juego */}
            <div className="flex justify-center mt-4">
                <button onClick={togglePlayPause} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                    {isPlaying ? '⏸️ Pausar' : '▶️ Iniciar'}
                </button>
            </div>

            {/* Inventario y botones para canjear objetos */}
            <div className="mt-4">
                <h2 className="text-lg font-bold">Inventario</h2>
                <div className="flex space-x-2">
                    <button onClick={() => redeemItem('specialFood')} className="px-4 py-2 bg-blue-500 text-white rounded">Canjear Comida Especial ($50)</button>
                    <button onClick={() => redeemItem('toy')} className="px-4 py-2 bg-green-500 text-white rounded">Canjear Juguete ($50)</button>
                    <button onClick={() => redeemItem('toothbrush')} className="px-4 py-2 bg-teal-500 text-white rounded">Canjear Cepillo de Dientes ($50)</button>
                    <button onClick={() => redeemItem('energizer')} className="px-4 py-2 bg-purple-500 text-white rounded">Canjear Energizante ($50)</button>
                </div>
                <div className="flex space-x-2 mt-2">
                    <button onClick={() => useItem('specialFood')} className="px-4 py-2 bg-blue-500 text-white rounded">Usar Comida Especial ({inventory.specialFood})</button>
                    <button onClick={() => useItem('toy')} className="px-4 py-2 bg-green-500 text-white rounded">Usar Juguete ({inventory.toy})</button>
                    <button onClick={() => useItem('toothbrush')} className="px-4 py-2 bg-teal-500 text-white rounded">Usar Cepillo de Dientes ({inventory.toothbrush})</button>
                    <button onClick={() => useItem('energizer')} className="px-4 py-2 bg-purple-500 text-white rounded">Usar Energizante ({inventory.energizer})</button>
                </div>
            </div>

            {/* Modal para fondos insuficientes */}
            {showInsufficientFundsModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Fondos Insuficientes</h2>
                        <p>No tienes suficiente dinero para esta acción.</p>
                        <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={handleCloseInsufficientFundsModal}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal para Game Over */}
            {isGameOver && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Game Over</h2>
                        <p>El Tamagotchi ha entrado en estado crítico y el juego ha terminado.</p>
                        <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={restartGame}>
                            Reiniciar
                        </button>
                    </div>
                </div>
            )}


            {/* Modal para multa */}
            {showFineModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">¡Multa!</h2>
                        <p>Has hecho trabajar demasiado al Tamagotchi. Puedes pagar una multa de todo tu dinero o no podrás trabajar más.</p>
                        <div className="flex space-x-2 mt-4">
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={payFine}>
                                Pagar Multa
                            </button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={doNotPayFine}>
                                No Pagar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}