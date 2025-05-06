export const StatsBlock = () => {
    return (
        <section className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl shadow w-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">📊 Estadísticas del administrador</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Usuarios registrados" value="521" color="text-blue-600" />
            <StatCard label="Prestadores de servicio" value="132" color="text-indigo-600" />
            <StatCard label="Categorías activas" value="12" color="text-green-600" />
            <StatCard label="Solicitudes pendientes" value="8" color="text-yellow-600" />
            <StatCard label="Solicitudes aprobadas" value="45" color="text-emerald-600" />
            <StatCard label="Solicitudes rechazadas" value="11" color="text-red-600" />
          </div>
        </section>
      )
    }
    
    const StatCard = ({ label, value, color }: { label: string, value: string, color: string }) => {
      return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h4 className="text-gray-500 dark:text-gray-300 text-sm">{label}</h4>
          <p className={`text-3xl font-bold ${color} dark:${color.replace('text-', 'text-')}`}>{value}</p>
        </div>
      )
    }