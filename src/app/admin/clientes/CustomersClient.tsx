"use client";

import React, { useState } from "react";

export type Customer = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  phone: string | null;
  role: string;
  location: string | null;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
};

export function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtrado reactivo
  const filteredCustomers = customers.filter((cust) => {
    const matchesRole =
      filterRole === "ALL"
        ? true
        : filterRole === "WITH_ORDERS"
        ? cust.ordersCount > 0
        : filterRole === "NO_ORDERS"
        ? cust.ordersCount === 0
        : cust.role === filterRole;

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      cust.email.toLowerCase().includes(q) ||
      cust.fullName.toLowerCase().includes(q) ||
      (cust.phone && cust.phone.includes(q)) ||
      (cust.location && cust.location.toLowerCase().includes(q));

    return matchesRole && matchesQuery;
  });

  // Métricas
  const totalUsers = customers.length;
  const buyersCount = customers.filter((c) => c.ordersCount > 0).length;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  // Exportar a CSV
  const handleExportCSV = () => {
    if (customers.length === 0) {
      alert("No hay clientes para exportar.");
      return;
    }

    const headers = ["ID", "Nombre", "Email", "Telefono", "Rol", "Ciudad", "Total_Pedidos", "Total_Facturado_COP", "Fecha_Registro"];
    const rows = filteredCustomers.map((c) => [
      `"${c.id}"`,
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${c.email}"`,
      `"${c.phone || ""}"`,
      `"${c.role}"`,
      `"${(c.location || "").replace(/"/g, '""')}"`,
      `"${c.ordersCount}"`,
      `"${c.totalSpent}"`,
      `"${new Date(c.createdAt).toISOString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cloto_clientes_crm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Limpiar número de teléfono para enlace de WhatsApp
  const cleanPhoneForWhatsApp = (rawPhone: string | null) => {
    if (!rawPhone) return null;
    const clean = rawPhone.replace(/\D/g, "");
    if (clean.length === 10) return `57${clean}`;
    return clean;
  };

  return (
    <div className="space-y-6">
      {/* 1. Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
            Cuentas Creadas en la Tienda
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900">{totalUsers}</span>
            <span className="text-xs text-stone-500">usuarios registrados</span>
          </div>
          <p className="text-[11px] text-stone-400">Personas con cuenta activa en Cloto.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
            Compradores Activos
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700">{buyersCount}</span>
            <span className="text-xs text-emerald-600 font-medium">con al menos 1 pedido</span>
          </div>
          <p className="text-[11px] text-stone-400">Han concretado compras en la tienda.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
            Ventas Totales de Usuarios
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#b6a450]">{formatCOP(totalRevenue)}</span>
          </div>
          <p className="text-[11px] text-stone-400">Facturación acumulada en cuentas registradas.</p>
        </div>
      </div>

      {/* 2. Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, correo, teléfono o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#b6a450] text-stone-900"
            />
            <svg
              className="w-4 h-4 text-stone-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:border-[#b6a450]"
          >
            <option value="ALL">Todos los Usuarios</option>
            <option value="WITH_ORDERS">Con Pedidos Realizados</option>
            <option value="NO_ORDERS">Sin Pedidos Aún</option>
            <option value="ADMIN">Administradores</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="w-full md:w-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-[#f2f1e7] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <svg className="w-4 h-4 text-[#b6a450]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Exportar a Excel / CSV</span>
        </button>
      </div>

      {/* 3. Tabla CRM de Usuarios */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="font-serif-title text-base font-medium text-stone-800">
              No se encontraron usuarios registrados
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Los clientes que se registren en la tienda aparecerán aquí con sus datos de contacto y pedidos.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Cliente / Nombre</th>
                  <th className="py-3 px-4 font-bold">Correo Electrónico</th>
                  <th className="py-3 px-4 font-bold">Teléfono / WhatsApp</th>
                  <th className="py-3 px-4 font-bold">Ubicación</th>
                  <th className="py-3 px-4 font-bold">Pedidos / Compras</th>
                  <th className="py-3 px-4 font-bold">Rol</th>
                  <th className="py-3 px-4 font-bold">Fecha Registro</th>
                  <th className="py-3 px-4 font-bold text-right">Contacto Rápido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {filteredCustomers.map((cust) => {
                  const initials = (cust.firstName?.charAt(0) || cust.email.charAt(0) || "U").toUpperCase();
                  const waNumber = cleanPhoneForWhatsApp(cust.phone);

                  return (
                    <tr key={cust.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Nombre y Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#f2f1e7] border border-[#dfd8cb] text-[#b6a450] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 block text-xs">
                              {cust.fullName}
                            </span>
                            <span className="text-[10px] text-stone-400 block font-mono">
                              ID: {cust.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Correo */}
                      <td className="py-3 px-4">
                        <span className="text-stone-800 select-all block">
                          {cust.email}
                        </span>
                      </td>

                      {/* Teléfono */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {cust.phone ? (
                          <span className="font-mono text-stone-800 text-[11px]">
                            {cust.phone}
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[11px] italic">No registrado</span>
                        )}
                      </td>

                      {/* Ubicación */}
                      <td className="py-3 px-4 text-stone-600 text-[11px]">
                        {cust.location || <span className="text-stone-400 italic">Sin dirección</span>}
                      </td>

                      {/* Compras / Pedidos */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div>
                          <span className="font-semibold text-stone-900 block">
                            {cust.ordersCount} {cust.ordersCount === 1 ? "pedido" : "pedidos"}
                          </span>
                          {cust.ordersCount > 0 && (
                            <span className="text-[10px] text-[#8c7b30] font-bold block">
                              {formatCOP(cust.totalSpent)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            cust.role === "ADMIN"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                        >
                          {cust.role === "ADMIN" ? "Super Admin" : "Cliente"}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="py-3 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                        {new Date(cust.createdAt).toLocaleDateString("es-CO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                        {/* WhatsApp Directo */}
                        {waNumber ? (
                          <a
                            href={`https://wa.me/${waNumber}?text=Hola%20${encodeURIComponent(
                              cust.firstName || "Estimado cliente"
                            )}%2C%20te%20saludamos%20desde%20Cloto%20Colombia`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-semibold transition-colors inline-block"
                            title="Chatear por WhatsApp"
                          >
                            WhatsApp ↗
                          </a>
                        ) : null}

                        {/* Email */}
                        <a
                          href={`mailto:${cust.email}?subject=Atención%20al%20cliente%20Cloto%20Colombia`}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-medium transition-colors inline-block"
                          title="Enviar correo"
                        >
                          Email
                        </a>

                        {/* Copiar Correo */}
                        <button
                          type="button"
                          onClick={() => handleCopy(cust.email, cust.id)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-medium transition-colors"
                          title="Copiar correo"
                        >
                          {copiedId === cust.id ? "¡Copiado!" : "Copiar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
