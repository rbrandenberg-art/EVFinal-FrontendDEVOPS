import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

// 1. Centralizamos las URLs.
const API_VENTAS = import.meta.env.VITE_API_VENTAS;
const API_DESPACHOS = import.meta.env.VITE_API_DESPACHOS;

// Para el entorno de visualización, nombramos el componente principal como App 
// y lo exportamos por defecto.
export default function App({ venta, onClose }) {
  const { register, handleSubmit } = useForm();
  const [mensaje, setMensaje] = useState(null);

  // Valores por defecto por si el componente se renderiza sin la prop 'venta'
  const datosVenta = venta || {
    idVenta: "N/A",
    direccionCompra: "Dirección de prueba",
    valorCompra: 0
  };

  const onSubmit = async (data) => {
    const jsonData = {
      fechaDespacho: data.fechaDespacho,
      patenteCamion: data.patenteCamion,
      intento: 0,
      entregado: false,
      idCompra: datosVenta.idVenta,
      direccionCompra: datosVenta.direccionCompra,
      valorCompra: datosVenta.valorCompra,
    };

    const jsonDataSales = {
      despachoGenerado: true,
    };

    try {
      // 2. Usamos la variable en lugar de la URL quemada
      if (datosVenta.idVenta !== "N/A") {
          await axios.put(`${API_VENTAS}/${datosVenta.idVenta}`, jsonDataSales, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
      }
      
      // 3. Usamos la variable para despachos
      await axios.post(API_DESPACHOS, jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      setMensaje({ titulo: "Despacho registrado 🛻!", texto: "El despacho ha sido generado con éxito en la base de datos", tipo: "success" });
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setMensaje({ titulo: "Error", texto: "Hubo un problema de conexión con el servidor.", tipo: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {mensaje && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className={`text-2xl font-bold mb-4 ${mensaje.tipo === 'error' ? 'text-red-600' : 'text-green-600'}`}>{mensaje.titulo}</h3>
            <p className="mb-6">{mensaje.texto}</p>
            <button onClick={() => { setMensaje(null); if(mensaje.tipo === 'success' && onClose) onClose(); }} className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold">Aceptar</button>
          </div>
        </div>
      )}
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center text-left text-lg"
        >
          <div className="mx-auto text-2xl font-bold mb-8 text-teal-600 text-center">
            Ingreso de orden de despacho
          </div>
          
          <div className="mb-5">
            <label className="block font-bold mb-2 text-gray-700">Fecha de despacho</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg block w-full p-2 focus:ring-teal-500 focus:border-teal-500"
              {...register("fechaDespacho", { required: true })}
            />
          </div>
          
          <div className="mb-5">
            <label className="block font-bold mb-2 text-gray-700">Patente de camión</label>
            <input
              type="text"
              placeholder="Elige patente de camión"
              className="border border-gray-300 rounded-lg block w-full p-2 focus:ring-teal-500 focus:border-teal-500"
              {...register("patenteCamion", { required: true })}
            />
          </div>
          
          <div className="mb-5">
            <label className="block font-bold mb-2 text-gray-700">Orden de compra asociado</label>
            <input
              type="text"
              disabled={true}
              value={datosVenta.idVenta}
              className="border border-gray-300 rounded-lg block w-full text-slate-500 p-2 bg-gray-100"
            />
          </div>
          
          <div className="mb-5">
            <label className="block font-bold mb-2 text-gray-700">Dirección de entrega</label>
            <input
              type="text"
              disabled={true}
              value={datosVenta.direccionCompra}
              className="border border-gray-300 rounded-lg block w-full text-slate-500 p-2 bg-gray-100"
            />
          </div>
          
          <div className="mb-8">
            <label className="block font-bold mb-2 text-gray-700">Valor de compra</label>
            <input
              type="number"
              value={datosVenta.valorCompra}
              className="border border-gray-300 rounded-lg block w-full text-slate-500 p-2 bg-gray-100"
              disabled={true}
            />
          </div>

          <button
            className="w-full py-3 px-4 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition duration-300 ease-in-out shadow-md"
            type="submit"
          >
            Asignar despacho
          </button>
        </form>
      </div>
    </div>
  );
}