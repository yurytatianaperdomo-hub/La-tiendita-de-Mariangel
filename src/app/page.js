"use client";
import { useState } from 'react';

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
    { id: "8801", nombre: "Papel Higiénico Jumbo", unidad: "Unidad", precio: 12000, stock: 12 },
  ]);

  const [historialVentas, setHistorialVentas] = useState([]);
  const [pagosProveedores, setPagosProveedores] = useState([]);
  const [nuevoProd, setNuevoProd] = useState({ id: "", nombre: "", unidad: "Unidad", precio: "", stock: "" });
  const [nuevoPago, setNuevoPago] = useState({ proveedor: "", monto: "", concepto: "", fecha: "" });

  const manejarLogin = (e) => {
    e.preventDefault();
    if (usuarioInput === "admin" && passInput === "mariangel2026") setEstaLogueado(true);
    else alert("Acceso denegado");
  };

  const finalizarVenta = () => {
    if (carrito.length === 0) return alert("Carrito vacío");
    const fecha = new Date().toLocaleString();
    let nInv = [...productos];
    let nRegs = [];
    carrito.forEach(item => {
      const i = nInv.findIndex(p => p.id === item.id);
      if (i !== -1) {
        nInv[i].stock -= item.cantidad;
        nRegs.push({ fecha, nombre: item.nombre, unidad: item.unidad, cant: item.cantidad, uni: item.precio, tot: item.precio * item.cantidad, stF: nInv[i].stock });
      }
    });
    setHistorialVentas([...historialVentas, ...nRegs]);
    setProductos(nInv);
    setCarrito([]);
    setPagoCliente("");
    alert("Venta Exitosa");
  };

  const agregarAlCarrito = (p) => {
    const ex = carrito.find(item => item.id === p.id);
    if (ex) setCarrito(carrito.map(i => i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    else setCarrito([...carrito, { ...p, cantidad: 1 }]);
    setBusqueda("");
  };

  const ajustarCant = (id, d) => {
    setCarrito(carrito.map(i => i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + d) } : i));
  };

  const total = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
  const devuelta = pagoCliente - total > 0 ? pagoCliente - total : 0;

  if (!estaLogueado) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl text-center">
        <h2 className="text-blue-600 font-black text-xs uppercase mb-2">Seguridad</h2>
        <h1 className="text-2xl font-black mb-8 border-b pb-4">LA TIENDITA DE MARIANGEL</h1>
        <form onSubmit={manejarLogin} className="space-y-4">
          <input type="text" placeholder="Usuario" onChange={e=>setUsuarioInput(e.target.value)} className="w-full p-4 border rounded-2xl outline-none focus:border-blue-500 bg-gray-50" />
          <input type="password" placeholder="Contraseña" onChange={e=>setPassInput(e.target.value)} className="w-full p-4 border rounded-2xl outline-none focus:border-blue-500 bg-gray-50" />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition">ENTRAR</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 text-slate-900 font-sans">
      {/* MENÚ RESPONSIVO */}
      <div className="w-full lg:w-64 bg-slate-900 text-white p-6 shrink-0 shadow-2xl overflow-y-auto">
        <h2 className="text-center font-black text-blue-400 text-sm uppercase">La Tiendita de</h2>
        <h1 className="text-center font-black text-xl mb-6 lg:mb-10 border-b border-slate-700 pb-4">MARIANGEL</h1>
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-4 lg:pb-0">
          <button onClick={()=>setVista("ventas")} className={`whitespace-nowrap lg:w-full text-left p-3 rounded-xl transition ${vista==='ventas'?'bg-blue-600':'hover:bg-slate-800'}`}>🛒 Ventas</button>
          <button onClick={()=>setVista("gestion")} className={`whitespace-nowrap lg:w-full text-left p-3 rounded-xl transition ${vista==='gestion'?'bg-blue-600':'hover:bg-slate-800'}`}>📦 Productos</button>
          <button onClick={()=>setVista("proveedores")} className={`whitespace-nowrap lg:w-full text-left p-3 rounded-xl transition ${vista==='proveedores'?'bg-blue-600':'hover:bg-slate-800'}`}>💰 Proveedores</button>
          <button onClick={()=>setVista("reportes")} className={`whitespace-nowrap lg:w-full text-left p-3 rounded-xl transition ${vista==='reportes'?'bg-blue-600':'hover:bg-slate-800'}`}>📈 Reportes</button>
        </nav>
      </div>

      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {vista === "ventas" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
              <input type="text" value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Buscar..." className="w-full p-4 border rounded-xl bg-slate-50 outline-none text-xl mb-4 focus:border-blue-500" />
              <div className="space-y-2 max-h-[300px] lg:max-h-[500px] overflow-y-auto">
                {busqueda && productos.filter(p=>p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(p=>(
                  <button key={p.id} onClick={()=>agregarAlCarrito(p)} className="w-full flex justify-between p-4 bg-slate-50 border rounded-xl hover:bg-blue-50 transition">
                    <span className="font-bold">{p.nombre}</span><b className="text-blue-600">${p.precio.toLocaleString('es-CO')}</b>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border max-h-[300px] overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Carrito</h3>
                {carrito.map(i=>(
                  <div key={i.id} className="flex flex-wrap justify-between items-center py-3 border-b border-slate-50 gap-2">
                    <span className="font-bold w-full lg:w-1/4">{i.nombre}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>ajustarCant(i.id, -1)} className="bg-gray-200 w-8 h-8 rounded-lg font-bold">-</button>
                      <span className="font-black w-6 text-center">{i.cantidad}</span>
                      <button onClick={()=>ajustarCant(i.id, 1)} className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg font-bold">+</button>
                    </div>
                    <span className="font-bold">${(i.precio*i.cantidad).toLocaleString('es-CO')}</span>
                    <button onClick={()=>setCarrito(carrito.filter(c=>c.id!==i.id))} className="text-xl">🗑️</button>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4"><span>TOTAL:</span><span className="text-4xl font-black">${total.toLocaleString('es-CO')}</span></div>
                <input type="number" value={pagoCliente} onChange={e=>setPagoCliente(e.target.value)} className="w-full p-3 bg-slate-800 border-slate-700 rounded-xl text-2xl font-bold text-green-400 text-center mb-4" placeholder="Recibido" />
                <div className="flex justify-between p-4 bg-blue-900/30 rounded-xl mb-4 border border-blue-800"><span>DEVUELTA:</span><span className="text-3xl font-black">${devuelta.toLocaleString('es-CO')}</span></div>
                <button onClick={finalizarVenta} className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-xl hover:bg-green-500 shadow-lg">✅ COBRAR</button>
              </div>
            </div>
          </div>
        )}

        {vista === "gestion" && (
          <div className="max-w-2xl mx-auto bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black mb-6">📦 Registro de Mercancía</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><input type="text" placeholder="Nombre del Producto" onChange={e=>setNuevoProd({...nuevoProd, nombre: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
              <input type="text" placeholder="Und (kg/unid)" onChange={e=>setNuevoProd({...nuevoProd, unidad: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="Código/ID" onChange={e=>setNuevoProd({...nuevoProd, id: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="number" placeholder="Precio Venta" onChange={e=>setNuevoProd({...nuevoProd, precio: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="number" placeholder="Stock" onChange={e=>setNuevoProd({...nuevoProd, stock: e.target.value})} className="w-full p-3 border rounded-xl" />
              <button onClick={()=>{setProductos([...productos,{...nuevoProd, precio:parseInt(nuevoProd.precio), stock:parseInt(nuevoProd.stock)}]); alert("Guardado");}} className="md:col-span-2 bg-blue-600 text-white py-4 rounded-xl font-bold mt-4">💾 GUARDAR</button>
            </div>
          </div>
        )}

        {vista === "proveedores" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-2xl font-black mb-6 italic">💰 Pago a Proveedores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Proveedor" onChange={e=>setNuevoPago({...nuevoPago, proveedor: e.target.value})} className="w-full p-3 border rounded-xl" />
                <input type="number" placeholder="Monto Pagado" onChange={e=>setNuevoPago({...nuevoPago, monto: e.target.value})} className="w-full p-3 border rounded-xl" />
                <input type="text" placeholder="Concepto (Factura #)" onChange={e=>setNuevoPago({...nuevoPago, concepto: e.target.value})} className="w-full p-3 border rounded-xl md:col-span-2" />
                <button onClick={()=>{setPagosProveedores([...pagosProveedores, {...nuevoPago, fecha: new Date().toLocaleString()}]); alert("Pago Registrado");}} className="md:col-span-2 bg-slate-800 text-white py-4 rounded-xl font-bold">REGISTRAR PAGO</button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead><tr className="bg-gray-100 font-bold uppercase"><th className="p-3">Fecha</th><th className="p-3">Proveedor</th><th className="p-3">Concepto</th><th className="p-3">Monto</th></tr></thead>
                <tbody>{pagosProveedores.map((p,i)=>(<tr key={i} className="border-b"><td className="p-3">{p.fecha}</td><td className="p-3 font-bold">{p.proveedor}</td><td className="p-3">{p.concepto}</td><td className="p-3 font-black text-red-600">${parseInt(p.monto).toLocaleString('es-CO')}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {vista === "reportes" && (
          <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <h2 className="text-2xl font-black mb-6">📈 Historial de Ventas</h2>
            <table className="w-full text-xs text-left">
              <thead><tr className="bg-slate-100 uppercase border-b"><th className="p-4">Fecha</th><th className="p-4">Producto</th><th className="p-4">Cant</th><th className="p-4 text-green-700">Total</th><th className="p-4 bg-orange-50 text-orange-700">Stock Final</th></tr></thead>
              <tbody>{historialVentas.map((v,i)=>(<tr key={i} className="border-b"><td className="p-4 text-slate-400">{v.fecha}</td><td className="p-4 font-bold">{v.nombre}</td><td className="p-4 font-black">{v.cant}</td><td className="p-4 font-black text-green-600">${v.tot.toLocaleString('es-CO')}</td><td className="p-4 font-bold bg-orange-50 text-orange-700 text-center">{v.stF}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
