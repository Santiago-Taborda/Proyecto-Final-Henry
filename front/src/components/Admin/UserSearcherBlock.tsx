'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type User = {
  id: string
  name: string
  email: string
  role: 'customer' | 'provider' | 'admin' | 'superadmin'
  createdAt: string
  phone: string
  address: string
  imgUrl: string
  deletedAt: string | null
  serviceProfile?: {
    id: string
    serviceTitle: string
    rating: number | null
    appointmentPrice: string
    description?: string
    category?: {
      id: string
      name: string
    }
  }
}

const UserSearcherByEmail = () => {
  const [email, setEmail] = useState('')
  const [foundUser, setFoundUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSearch = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa un email')
      return
    }

    if (!email.includes('@')) {
      setError('El email debe ser válido')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.status === 401) {
        throw new Error('No autorizado - Sesión expirada')
      }

      if (response.status === 404) {
        throw new Error('Usuario no encontrado')
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const userData = await response.json()
      setFoundUser({
        ...userData,
        serviceProfile: userData.serviceProfile || undefined
      })
      setIsModalOpen(true)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'No autorizado - Sesión expirada') {
          localStorage.removeItem('token')
          router.push('/login')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al buscar usuario')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    if (foundUser?.deletedAt === null) {
      setShowDeleteConfirmation(true)
    }
  }

  const confirmDelete = async () => {
    if (!foundUser || foundUser.deletedAt !== null) return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/softDelete/email`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: foundUser.email })
      })

      if (response.status === 401) {
        throw new Error('No autorizado - Sesión expirada')
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error ${response.status}`)
      }

      const updatedUser = await response.json()
      setFoundUser({
        ...updatedUser,
        serviceProfile: updatedUser.serviceProfile || foundUser.serviceProfile
      })
      setShowDeleteConfirmation(false)
      
      // Mostrar notificación de éxito
      alert(`Usuario ${foundUser.email} desactivado correctamente`)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'No autorizado - Sesión expirada') {
          localStorage.removeItem('token')
          router.push('/login')
        } else {
          setError(err.message)
          alert(`Error al desactivar: ${err.message}`)
        }
      } else {
        setError('Error desconocido al desactivar usuario')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleName = (role: string) => {
    switch(role) {
      case 'customer': return 'Cliente'
      case 'provider': return 'Proveedor'
      case 'admin': return 'Administrador'
      case 'superadmin': return 'Super Admin'
      default: return role
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Buscar Usuario por Email</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
        Ingresa el email del usuario para gestionar su cuenta.
      </p>
      
      <div className="flex gap-4">
        <input
          type="email"
          placeholder='ejemplo@dominio.com'
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value.trim())
            setError(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buscando...
            </>
          ) : (
            'Buscar'
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-300">
          <p>{error}</p>
        </div>
      )}

      {/* Modal de detalles del usuario */}
      {isModalOpen && foundUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Detalles del Usuario
            </h3>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0">
                <Image
                  src={foundUser.imgUrl || '/default-avatar.png'}
                  alt="Avatar"
                  width={120}
                  height={120}
                  className="rounded-full border-2 border-gray-200 dark:border-gray-600"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{foundUser.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 break-all">{foundUser.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    foundUser.deletedAt === null
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {foundUser.deletedAt === null ? 'Activo' : 'Desactivado'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Rol:</strong></p>
                    <p className="text-gray-800 dark:text-white">{getRoleName(foundUser.role)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Teléfono:</strong></p>
                    <p className="text-gray-800 dark:text-white">{foundUser.phone || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Registro:</strong></p>
                    <p className="text-gray-800 dark:text-white">
                      {new Date(foundUser.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400"><strong>ID:</strong></p>
                    <p className="text-gray-800 dark:text-white font-mono text-sm">{foundUser.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {foundUser.address && (
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400"><strong>Dirección:</strong></p>
                <p className="text-gray-800 dark:text-white">{foundUser.address}</p>
              </div>
            )}

            {foundUser.role === 'provider' && foundUser.serviceProfile && (
              <div className="mt-6 border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Perfil de Servicio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Servicio:</strong></p>
                    <p className="text-gray-800 dark:text-white">{foundUser.serviceProfile.serviceTitle}</p>
                    
                    <p className="text-gray-600 dark:text-gray-400 mt-3"><strong>Precio por cita:</strong></p>
                    <p className="text-gray-800 dark:text-white">${foundUser.serviceProfile.appointmentPrice}</p>
                    
                    <p className="text-gray-600 dark:text-gray-400 mt-3"><strong>Calificación:</strong></p>
                    <div className="flex items-center">
                      <span className="text-yellow-500">
                        {foundUser.serviceProfile.rating 
                          ? '★'.repeat(Math.round(foundUser.serviceProfile.rating)) + '☆'.repeat(5 - Math.round(foundUser.serviceProfile.rating))
                          : 'Sin calificaciones'}
                      </span>
                      {foundUser.serviceProfile.rating && (
                        <span className="ml-2 text-gray-800 dark:text-white">
                          ({foundUser.serviceProfile.rating.toFixed(1)})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {foundUser.serviceProfile.category && (
                      <>
                        <p className="text-gray-600 dark:text-gray-400"><strong>Categoría:</strong></p>
                        <p className="text-gray-800 dark:text-white">{foundUser.serviceProfile.category.name}</p>
                      </>
                    )}
                    
                    {foundUser.serviceProfile.description && (
                      <>
                        <p className="text-gray-600 dark:text-gray-400 mt-3"><strong>Descripción:</strong></p>
                        <p className="text-gray-800 dark:text-white">{foundUser.serviceProfile.description}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cerrar
              </button>
              
              {foundUser.deletedAt === null && (
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    'Desactivar Usuario'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de desactivación */}
      {showDeleteConfirmation && foundUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Confirmar Desactivación
            </h3>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Estás por desactivar:</p>
              <p className="text-lg font-semibold mt-1">{foundUser.name}</p>
              <p className="text-sm break-all">{foundUser.email}</p>
              {foundUser.serviceProfile && (
                <p className="mt-2 text-sm">Servicio: {foundUser.serviceProfile.serviceTitle}</p>
              )}
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-gray-800 dark:text-gray-200 font-medium">Esta acción:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Bloqueará el acceso del usuario al sistema</li>
                {foundUser.role === 'provider' && <li>Ocultará todos sus servicios</li>}
                <li>No eliminará sus datos permanentemente</li>
                <li>Puede revertirse en cualquier momento</li>
              </ul>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {isLoading ? 'Procesando...' : 'Confirmar Desactivación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserSearcherByEmail