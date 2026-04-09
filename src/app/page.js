"use client";
import './globals.css';
import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Plus, 
  Trash2, 
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function TienditaMariangel() {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [usuarioInput, setUsuarioInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [vista, setVista] = useState("ventas");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [pagoCliente, setPagoCliente] = useState("");
  
  const [productos, setProductos] = useState([
    { id: "7701", nombre: "Arroz Diana", unidad: "1kg", precio: 4200, stock: 50 },
    { id: "8802", nombre: "Aceite Gourmet", unidad: "1L", precio: 12000, stock: 12 },
    { id: "9903", nombre: "Papel Higiénico", unidad: "4 rollos", precio: 8500, stock: 20 }
  ]);

  const manejarLogin = (e) => {
    e.preventDefault();
    if (usuarioInput === "admin" && passInput === "mariangel2026") {
      setEstaLogueado(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) return alert("Sin existencias");
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const devuelta = pagoCliente ? (parseFloat(pagoCliente) - totalCarrito) : 0;

  if (!estaLogueado) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={manejarLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">LA TIENDITA DE</h1>
          <h2 className="text-4xl font-black text-center text-slate-800 mb-8 tracking-tighter">MARIANGEL</h2>
          <div className="space-y-4">
            <input 
              type="text" placeholder="Usuario" 
              className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              value={usuarioInput} onChange={(e) => setUsuarioInput(e.target.value)}
            />
            <input 
              type="password" placeholder="Contraseña" 
              className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              value={passInput} onChange={(e) => setPassInput(e.target.value)}
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
              INGRESAR AL SISTEMA
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <nav className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-blue-400 italic mb-8">Mariangel App</h2>
        <button onClick={() => setVista("ventas")} className={`flex items-center gap-3 p-3 rounded-lg transition ${vista === "ventas" ? "bg-blue-600" : "hover:bg-slate-800"}`}>
          <ShoppingCart size={20} /> Ventas
        </button>
        <button onClick={() => setVista("productos")} className={`flex items-center gap-3 p-3 rounded-lg transition ${vista === "productos" ? "bg-blue-600" : "hover:bg-slate-800"}`}>
          <Package size={20} /> Productos
        </button>
        <button onClick={() => setEstaLogueado(false)} className="mt-auto flex items-center gap-3 p-3 text-red-400 hover:bg-red-950 rounded-lg transition">
          <XCircle size={20} /> Cerrar Sesión
        </button>
      </nav>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {vista === "ventas" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 border">
                <Search className="text-slate-400" />
                <input 
                  type="text" placeholder="Buscar producto..."
                  className="w-full outline-none text-slate-700"
                  value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(p => (
                  <div key={p.id} onClick={() => agregarAlCarrito(p)} className="bg-white p-4 rounded-xl shadow-sm border hover:border-blue-400 cursor-pointer transition-all">
                    <h3 className="font-bold text-slate-800">{p.nombre}</h3>
                    <p className="text-2xl font-black text-slate-900 mt-2">${p.precio.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Stock: {p.stock}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border p-4 h-fit">
              <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} className="text-blue-600" /> Carrito
              </h2>
              <div className="space-y-3 mb-4">
                {carrito.map(item => (
                  <div key={item.id} className="flex justify-between text-sm border-b pb-2 text-slate-700">
                    <span>{item.cantidad}x {item.nombre}</span>
                    <span className="font-bold">${(item.cantidad * item.precio).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="text-xl font-black text-slate-900 flex justify-between mb-4">
                <span>TOTAL:</span>
                <span className="text-green-600">${totalCarrito.toLocaleString()}</span>
              </div>
              <input 
                type="number" placeholder="Pago cliente"
                className="w-full p-3 rounded-lg bg-slate-100 mb-4 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                value={pagoCliente} onChange={(e) => setPagoCliente(e.target.value)}
              />
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg transition-all">
                FINALIZAR VENTA
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
