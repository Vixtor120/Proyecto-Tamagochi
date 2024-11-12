import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Generador de IDs únicas para la 
sesión
function Contact() {
    // Estado para manejar los valores del formulario
    const [formData, setFormData] = useState({
        name: '', // Campo de nombre
        email: '', // Campo de email
        message: '' // Campo de mensaje
    });
    // Estado para manejar el mensaje de éxito después de enviar el 
    formulario
    const [successMessage, setSuccessMessage] = useState('');
    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target; // Captura el nombre y el valor del campo
        setFormData((prevData) => ({
            ...prevData, // Copia los datos previos
            [name]: value // Actualiza el campo correspondiente
        }));
    };
    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita el refresco de la página
        // Agregar una ID de sesión única al mensaje
        const dataToSend = {
            ...formData,
            sessionId: uuidv4(), // Genera un ID único para esta sesión
            timestamp: new Date().toISOString() // Marca de tiempo del envío
        };
        try {
            // Enviar los datos a JSON Server
            const response = await
                fetch('http://localhost:3001/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });
            if (response.ok) {
                // Mostrar mensaje de éxito
                setSuccessMessage('Gracias por tu mensaje. Hemos recibido tus comentarios.');
                // Limpiar el formulario
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                });
            } else {
                console.error('Error al guardar el mensaje');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };
    return (
        // Contenedor del formulario de contacto
        <div className="p-6 bg-white rounded-lg shadow-md w-80 mx-auto mt-8">
            {/* Título del formulario */}
            <h2 className="text-2xl font-bold text-center mb-4">Contacto</h2>
            {/* Mensaje de éxito */}
            {successMessage && (
                <p className="text-green-500 text-center mb-4">{successMessage}</p>
            )}
            {/* Formulario de contacto */}
            <form onSubmit={handleSubmit}>
                {/* Campo de Nombre */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Nombre:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </div>
                {/* Campo de Email */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Correo electrónico:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </div>
                {/* Campo de Mensaje */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Mensaje:</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" rows="4" required />
                </div>
                {/* Botón de envío */}
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Enviar</button>
            </form>
        </div>
    );
}
export default Contact;

