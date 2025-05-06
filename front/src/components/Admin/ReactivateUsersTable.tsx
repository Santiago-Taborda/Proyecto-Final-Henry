'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/contexts/UserContext'

type User = {
  id: string
  name: string
  email: string
  role: 'customer' | 'provider'
  deletedAt: string
  createdAt: string
  serviceProfile?: { id: string }
}

const ReactivateUsersTable = () => {
  const { usersUpdated, triggerUsersUpdate } = useUserContext()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [reactivatingId, setReactivatingId] = useState<string | null>(null)
  const router = useRouter()

  const fetchInactiveUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/inactive`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }
      
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleReactivate = async (userId: string) => {
    setError(null)
    setSuccess(null)
    setReactivatingId(userId)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reactivate/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `Error ${res.status}`)
      }

      // Actualización optimista
      const reactivatedUser = users.find(user => user.id === userId)
      setUsers(prev => prev.filter(user => user.id !== userId))
      
      setSuccess(reactivatedUser 
        ? `Usuario ${reactivatedUser.name} reactivado con éxito`
        : 'Usuario reactivado con éxito'
      )
      
      // Notificar a otros componentes
      triggerUsersUpdate()

    } catch (err) {
      setError(err instanceof Error 
        ? err.message 
        : 'Error al reactivar el usuario'
      )
      // Recargar datos si hay error
      fetchInactiveUsers()
    } finally {
      setReactivatingId(null)
    }
  }

  useEffect(() => {
    fetchInactiveUsers()
  }, [usersUpdated])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Usuarios Desactivados</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : users.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No hay usuarios desactivados</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Nombre</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Email</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Rol</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Desactivado</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.name}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'provider' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.role === 'provider' ? 'Proveedor' : 'Cliente'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                    {new Date(user.deletedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleReactivate(user.id)}
                      disabled={reactivatingId === user.id}
                      className={`px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm ${
                        reactivatingId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {reactivatingId === user.id ? 'Reactivando...' : 'Reactivar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ReactivateUsersTable