Aquí tienes el código completo y corregido. He incluido la línea import './globals.css'; al principio para que los colores funcionen y he añadido la lógica de Proveedores que habíamos hablado antes.

Copia todo esto y pégalo en tu archivo src/app/page.js borrando lo que tengas actualmente:

JavaScript
"use client";
import './globals.css';
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Plus, 
  Trash2, 
  Save, 
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
  
  // Datos iniciales
  const [productos, setProductos] = useState([
    { id: "7701", nombre: "Arroz Diana", unidad: "1kg", precio: 4200, stock: 50, categoria: "Granos" },
    { id: "8802", nombre: "Aceite Gourmet", unidad: "1L", precio: 12000, stock: 12, categoria: "Aceites" },
    { id: "9903", nombre: "Papel Higiénico Jumbo", unidad: "4 rollos", precio: 8500, stock: 20, categoria: "Aseo" }
  ]);

  const [proveedores, setProveedores] = useState([
    { id: 1, nombre: "Distribuidora El Grano", contacto: "3101234567", categoria: "Granos" },
    { id: 2, nombre: "Aseo Total S.A.", contacto: "3209876543", categoria: "Aseo" }
  ]);

  // Manejo de Login
  const manejarLogin = (e) => {
    e.preventDefault();
    if (usuarioInput === "admin" && passInput === "mariangel2026") {
      setEstaLogueado(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  // Funciones de Venta
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

  const procesarVenta = () => {
    if (carrito.length === 0) return;
    if (parseFloat(pagoCliente) < totalCarrito) return alert("Pago insuficiente");
    
    // Descontar stock
    const nuevosProductos = productos.map(p => {
      const enCarrito = carrito.find(c => c.id === p.id);
      return enCarrito ? { ...p, stock: p.stock - enCarrito.cantidad } : p;
    });
    
    setProductos(nuevosProductos);
    setCarrito([]);
    setPagoCliente("");
    alert("¡Venta Exitosa!");
  };

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
      {/* Sidebar / Menú lateral */}
      <nav className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-2">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-400 italic">Mariangel App</h2>
        </div>
        
        <button onClick={() => setVista("ventas")} className={`flex items-center gap-3 p-3 rounded-lg transition ${vista === "ventas" ? "bg-blue-600" : "hover:bg-slate-800"}`}>
          <ShoppingCart size={20} /> Ventas
        </button>
        <button onClick={() => setVista("productos")} className={`flex items-center gap-3 p-3 rounded-lg transition ${vista === "productos" ? "bg-blue-600" : "hover:bg-slate-800"}`}>
          <Package size={20} /> Productos
        </button>
        <button onClick={() => setVista("proveedores")} className={`flex items-center gap-3 p-3 rounded-lg transition ${vista === "proveedores" ? "bg-blue-600" : "hover:bg-slate-800"}`}>
          <Users size={20} /> Proveedores
        </button>
        <button onClick={() => setVista("reportes")} className={`flex items-center gap-3 p-3 rounded-lg transition ${vista === "reportes" ? "bg-blue-600" : "hover:bg-slate-800"}`}>
          <BarChart3 size={20} /> Reportes
        </button>
        
        <button onClick={() => setEstaLogueado(false)} className="mt-auto flex items-center gap-3 p-3 text-red-400 hover:bg-red-950 rounded-lg transition">
          <XCircle size={20} /> Cerrar Sesión
        </button>
      </nav>

      {/* Area Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* VISTA: PUNTO DE VENTA */}
        {vista === "ventas" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 border">
                <Search className="text-slate-400" />
                <input 
                  type="text" placeholder="Buscar producto por nombre o código..."
                  className="w-full outline-none text-slate-700"
                  value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(p => (
                  <div key={p.id} onClick={() => agregarAlCarrito(p)} className="bg-white p-4 rounded-xl shadow-sm border hover:border-blue-400 cursor-pointer transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">{p.unidad}</span>
                      <span className={`text-xs font-bold ${p.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>Stock: {p.stock}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600">{p.nombre}</h3>
                    <p className="text-2xl font-black text-slate-900 mt-2">${p.precio.toLocaleString()}</p>
                    <button className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white py-2 rounded-lg transition">
                      <Plus size={16} /> Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrito / Cobro */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-[600px]">
              <div className="p-4 border-b bg-slate-50 rounded-t-2xl">
                <h2 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
                  <ShoppingCart size={20} className="text-blue-600" /> Carrito de Venta
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {carrito.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                    <div>
                      <p className="font-bold text-sm text-slate-800">{item.nombre}</p>
                      <p className="text-xs text-slate-500">{item.cantidad} x ${item.precio.toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-blue-600">${(item.cantidad * item.precio).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-slate-900 text-white rounded-b-2xl space-y-4">
                <div className="flex justify-between text-2xl font-black">
                  <span>TOTAL:</span>
                  <span className="text-green-400">${totalCarrito.toLocaleString()}</span>
                </div>
                <input 
                  type="number" placeholder="¿Con cuánto paga?"
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={pagoCliente} onChange={(e) => setPagoCliente(e.target.value)}
                />
                {pagoCliente && (
                  <div className="flex justify-between text-lg font-bold text-slate-300">
                    <span>Devuelta:</span>
                    <span>${devuelta.toLocaleString()}</span>
                  </div>
                )}
                <button 
                  onClick={procesarVenta}
                  className="w-full bg-green-500 hover:bg-green-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <CheckCircle2 size={24} /> FINALIZAR COBRO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VISTA: PRODUCTOS / INVENTARIO (Simple para Mariangel) */}
        {vista === "productos" && (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Control de Inventario</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-slate-400 text-sm uppercase">
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-4">Unidad</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id} className="border-b hover:bg-slate-50 transition">
                      <td className="py-4 px-4 font-bold text-slate-700">{p.nombre}</td>
                      <td className="py-4 px-4">{p.unidad}</td>
                      <td className="py-4 px-4 font-bold text-blue-600">${p.precio.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {p.stock} dispon.
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              <Plus size={20} /> Nuevo Producto
            </button>
          </div>
        )}

        {/* VISTA: PROVEEDORES */}
        {vista === "proveedores" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proveedores.map(prov => (
              <div key={prov.id} className="bg-white p-6 rounded-2xl border shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-black text-xl">
                  {prov.nombre.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{prov.nombre}</h3>
                <p className="text-slate-500 text-sm mb-4">Contacto: {prov.contacto}</p>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-600">{prov.categoria}</span>
              </div>
            ))}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-blue-400 hover:text-blue-400 cursor-pointer transition">
               <Plus size={40} className="mb-2" />
               <p className="font-bold">Añadir Proveedor</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
