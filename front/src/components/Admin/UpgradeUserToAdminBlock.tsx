'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/contexts/UserContext'

type User = {
  id: string
  name: string
  email: string
  role: 'customer' | 'provider' | 'admin' | 'superadmin'
  createdAt: string
}

const UpgradeUserToAdminBlock = () => {
  const [email, setEmail] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()
  const { triggerUsersUpdate } = useUserContext()

  const searchUserByEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setSearchResults([])

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Por favor ingrese un email válido')
      }

      const normalizedEmail = email.toLowerCase().trim()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?email=${encodeURIComponent(normalizedEmail)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al buscar usuario')
      }

      const eligibleUsers = data.filter((user: User) => 
        ['customer', 'provider'].includes(user.role)
      )

      if (eligibleUsers.length === 0) {
        throw new Error(
          data.length > 0 
            ? 'Este usuario ya es administrador o superadmin' 
            : 'Usuario no encontrado'
        )
      }

      setSearchResults(eligibleUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgradeToAdmin = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/upgrade-admin`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: selectedUser.email.toLowerCase().trim() })
        }
      )

      const data = await response.json()

      if (response.status === 404) {
        throw new Error(data.message || 'Usuario no encontrado')
      }

      if (response.status === 409) {
        throw new Error(data.message || 'El usuario no puede ser promovido')
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el rol')
      }

      setSuccess(`¡${selectedUser.name} ahora es administrador!`)
      setSearchResults([])
      setEmail('')
      setSelectedUser(null)
      
      // Notificar a toda la aplicación sobre el cambio
      triggerUsersUpdate()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el usuario')
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roles = {
      customer: { 
        text: 'Cliente', 
        class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      },
      provider: { 
        text: 'Prestador', 
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
      },
      admin: { 
        text: 'Admin', 
        class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
      },
      superadmin: { 
        text: 'SuperAdmin', 
        class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
      }
    }
    return roles[role as keyof typeof roles] || { 
      text: role, 
      class: 'bg-gray-100 text-gray-800' 
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Promover a Administrador</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Busque usuarios por email para convertirlos en administradores
      </p>

      <form onSubmit={searchUserByEmail} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email del Usuario
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: usuario@ejemplo.com"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className={`w-full px-4 py-2 rounded-lg text-white ${
            isLoading || !email.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Buscando...' : 'Buscar Usuario'}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
          {success}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {searchResults.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(user.role).class}`}>
                      {getRoleBadge(user.role).text}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowConfirmation(true)
                      }}
                      disabled={isLoading}
                      className="px-3 py-1 text-sm rounded-md bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-400"
                    >
                      Promover a Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showConfirmation && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Confirmar Promoción</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              ¿Estás seguro de promover a <strong>{selectedUser.name}</strong> ({selectedUser.email}) a administrador?
            </p>
            
            <div className="bg-yellow-50 dark:bg-gray-700 p-3 rounded mb-4">
              <p className="text-sm"><strong>Rol actual:</strong> <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(selectedUser.role).class}`}>
                {getRoleBadge(selectedUser.role).text}
              </span></p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpgradeToAdmin}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLoading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isLoading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpgradeUserToAdminBlock