'use client'
import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  ArcElement,
  Tooltip, 
  Legend 
} from 'chart.js'
import Image from 'next/image'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

type StatsData = {
  summary: {
    activeUsers: number
    inactiveUsers: number
    activeServices: number
    pendingServices: number
    rejectedServices: number
    approvalRate: number
    totalAppointments: number
    pendingAppointments: number
  }
  services?: {
    category: string
    count: number
  }[]
  roles?: {
    clients: number
    providers: number
  }
}

export default function AdminStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [summaryRes, servicesRes, rolesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/summary`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/servicesdistribution`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/usersbyrole`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ])

        if (!summaryRes.ok || !servicesRes.ok || !rolesRes.ok) {
          throw new Error('Error al cargar estadísticas')
        }

        const summaryData = await summaryRes.json()
        const servicesData = await servicesRes.json()
        const rolesData = await rolesRes.json()

        // Verificación de datos
        if (!summaryData.activeUsers || !summaryData.totalAppointments) {
          console.warn('Datos potencialmente incorrectos recibidos:', summaryData)
        }

        setStats({
          summary: {
            ...summaryData,
            // Forzar números para evitar NaN
            activeUsers: summaryData.activeUsers || 0,
            inactiveUsers: summaryData.inactiveUsers || 0,
            totalAppointments: summaryData.totalAppointments || 0,
            pendingAppointments: summaryData.pendingAppointments || 0
          },
          services: servicesData,
          roles: rolesData
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 text-red-500 dark:text-red-400">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!stats) return null

  // Datos para gráficos
  const serviceCategories = stats.services?.map(item => item.category || 'Sin categoría') || []
  const serviceCounts = stats.services?.map(item => item.count) || []
  const roleLabels = ['Clientes', 'Prestadores']
  const roleData = stats.roles ? [stats.roles.clients, stats.roles.providers] : [0, 0]

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Panel de Administración
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Actualizado: {new Date().toLocaleTimeString()}
          </span>
          <button 
            onClick={() => window.location.reload()}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Image 
              src="/icons/refresh.svg" 
              width={20} 
              height={20} 
              alt="Actualizar" 
              className="dark:invert"
            />
          </button>
        </div>
      </div>

      {/* Sección de Usuarios */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Usuarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard 
            title="Usuarios Activos" 
            value={stats.summary.activeUsers}
            trend={stats.summary.activeUsers > 0 ? "up" : "stable"}
            icon="👤"
            description="Usuarios con cuentas activas"
          />
          <StatCard 
            title="Usuarios Inactivos" 
            value={stats.summary.inactiveUsers}
            trend={stats.summary.inactiveUsers > 0 ? "down" : "stable"}
            icon="🚫"
            description="Cuentas desactivadas"
          />
        </div>
      </div>

      {/* Sección de Servicios */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Servicios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Aprobados" 
            value={stats.summary.activeServices}
            trend={stats.summary.activeServices > 0 ? "up" : "stable"}
            icon="✔️"
            description="Servicios activos"
          />
          <StatCard 
            title="Pendientes" 
            value={stats.summary.pendingServices}
            trend={stats.summary.pendingServices > 0 ? "down" : "stable"}
            icon="⏳"
            description="En revisión"
          />
          <StatCard 
            title="Rechazados" 
            value={stats.summary.rejectedServices}
            trend={stats.summary.rejectedServices > 0 ? "down" : "stable"}
            icon="✖️"
            description="No aprobados"
          />
        </div>
        {stats.summary.activeServices > 0 && (
          <div className="mt-4">
            <StatCard 
              title="Tasa de Aprobación" 
              value={`${stats.summary.approvalRate}%`}
              trend={stats.summary.approvalRate > 70 ? "up" : stats.summary.approvalRate > 30 ? "stable" : "down"}
              icon="📊"
              fullWidth
            />
          </div>
        )}
      </div>

      {/* Sección de Citas */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Citas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard 
            title="Total de Citas" 
            value={stats.summary.totalAppointments}
            trend={stats.summary.totalAppointments > 0 ? "up" : "stable"}
            icon="📅"
            description="Todas las citas registradas"
          />
          <StatCard 
            title="Pendientes" 
            value={stats.summary.pendingAppointments}
            trend={stats.summary.pendingAppointments > 0 ? "down" : "stable"}
            icon="🔄"
            description="Citas por confirmar"
          />
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 dark:text-white mb-4">
            Distribución de Servicios por Categoría
          </h3>
          <div className="h-64">
            <Doughnut
              data={{
                labels: serviceCategories,
                datasets: [{
                  data: serviceCounts,
                  backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
                    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
                  ],
                }]
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                        const value = context.raw as number
                        const percentage = Math.round((value / total) * 100)
                        return `${context.label}: ${value} (${percentage}%)`
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 dark:text-white mb-4">
            Distribución de Usuarios
          </h3>
          <div className="h-64">
            <Doughnut
              data={{
                labels: roleLabels,
                datasets: [{
                  data: roleData,
                  backgroundColor: ['#3B82F6', '#10B981'],
                }]
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente StatCard mejorado
const StatCard = ({ 
  title, 
  value, 
  trend, 
  icon,
  description,
  fullWidth = false
}: {
  title: string
  value: number | string
  trend?: 'up' | 'down' | 'stable'
  icon: string
  description?: string
  fullWidth?: boolean
}) => {
  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→'
  }

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-yellow-500'
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {trend && (
            <span className={`text-sm ${trendColors[trend]}`}>
              {trendIcons[trend]}
            </span>
          )}
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}