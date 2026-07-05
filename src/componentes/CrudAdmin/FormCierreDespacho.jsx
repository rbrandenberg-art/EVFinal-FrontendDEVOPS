import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

// Nota para tu proyecto real: Usa import.meta.env.VITE_API_DESPACHOS
// Aquí usamos una cadena de texto temporal para asegurar la compilación en este entorno.
const API_DESPACHOS = import.meta.env.VITE_API_DESPACHOS;

export const FormCierreDespacho = ({ despacho, onClose }) => {
  const { register, handleSubmit } = useForm();
  const [mensaje, setMensaje] = useState(null);

  // Valores por defecto seguros por si 'despacho' llega indefinido en la vista previa
  const datosDespacho = despacho || {
    idDespacho: "N/A",
    fechaDespacho: "2026-07-05",
    patenteCamion: "AB-CD-12",
    intento: 0,
    idCompra: "N/A",
    direccionCompra: "Dirección de prueba",
    valorCompra: "15500"
  };

  const onSubmit = async (data) => {
    // Convertimos los datos de texto (String) que entrega el formulario 
    // a los tipos de datos reales que exige tu backend Spring Boot
    const jsonData = {
      intento: parseInt(data.intento), // Convertimos a número entero
      despachado: data.despachado === "true", // Convertimos el texto a booleano real
    };

    try {
      if (datosDespacho.idDespacho !== "N/A") {
          await axios.put(
            `${API_DESPACHOS}/${datosDespacho.idDespacho}`,
            jsonData,
            {
              headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
          );
      }
      
      setMensaje({ 
        tipo: 'success', 
        titulo: 'Despacho modificado 🛻!', 
        texto: 'El despacho ha sido modificado exitosamente' 
      });
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setMensaje({ 
        tipo: 'error', 
        titulo: 'Error', 
        texto: 'Hubo un problema de conexión al modificar el despacho.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {mensaje && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className={`text-2xl font-bold mb-4 ${mensaje.tipo === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {mensaje.titulo}
            </h3>
            <p className="mb-6">{mensaje.texto}</p>
            <button 
              onClick={() => { 
                setMensaje(null); 
                if(mensaje.tipo === 'success' && onClose) onClose(); 
              }} 
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto shadow-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center text-left text-lg"
        >
          <div className="mx-auto text-2xl font-bold mb-8 text-teal-600 text-center">
            Editar y cierre de despacho
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-700">ID despacho</label>
            <input
              disabled={true}
              type="text"
              className="border border-gray-300 rounded-lg block w-full p-2 text-slate-500 bg-gray-100"
              value={datosDespacho.idDespacho}
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-700">Fecha despacho</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg block w-full text-slate-500 p-2 bg-gray-100"
              value={datosDespacho.fechaDespacho}
              disabled={true}
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-700">Patente Camión</label>
            <input
              type="text"
              disabled={true}
              value={datosDespacho.patenteCamion}
              className="border border-gray-300 rounded-lg block w-full text-slate-500 p-2 bg-gray-100"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-700">Intentos de entrega</label>
            <input
              type="number"
              defaultValue={datosDespacho.intento}
              className="border border-gray-300 rounded-lg block w-full p-2 focus:ring-teal-500 focus:border-teal-500"
              {...register("intento", { required: true })}
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-700">Despacho entregado</label>
            <select
              defaultValue={"false"}
              className="border border-gray-300 rounded-lg block w-full p-2 focus:ring-teal-500 focus:border-teal-500"
              {...register("despachado", { required: true })}
            >
              <option value={"false"}>Despacho abierto</option>
              <option value={"true"}>Cerrar despacho</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-700">ID Compra</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg block w-full text-slate-500 p-2 bg-gray-100"
              disabled={true}
              value={datosDespacho.idCompra}
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-700">Dirección Compra</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg block w-full text-slate-500 p-2 bg-gray-100"
              disabled={true}
              value={datosDespacho.direccionCompra}
            />
          </div>
          
          <div className="mb-8">
            <label className="block font-bold mb-2 text-gray-700">Valor Compra</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg block w-full text-slate-500 p-2 bg-gray-100"
              disabled={true}
              value={datosDespacho.valorCompra}
            />
          </div>

          <button
            className="w-full py-3 px-4 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition duration-300 ease-in-out shadow-md"
            type="submit"
          >
            Modificar Despacho
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormCierreDespacho;