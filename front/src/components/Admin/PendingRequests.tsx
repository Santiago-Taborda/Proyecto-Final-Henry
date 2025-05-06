'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Address = {
  city: string
  state: string
  street: string
  country: string
  zipCode: string
  extNumber: string
  intNumber?: string
  neighborhood?: string
}

type Category = {
  id: string
  name: string
  description: string
}

type User = {
  id: string
  name: string
  email: string
  phone: number
  address: string
  imgUrl: string
}

type Media = {
  id: string
  imgUrl: string
  type: 'gallery' | 'certificate' | 'id_document'
  publicId: string
  resourceType: 'image' | 'video' | 'raw'
}

type Request = {
  id: string
  serviceTitle: string
  userName: string
  address: Address
  rating: number | null
  description: string
  appointmentPrice: string
  phone: string
  status: 'active' | 'pending' | 'rejected'
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  category: Category
  user: User
  images?: Media[]
}

const PendingRequests = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [documents, setDocuments] = useState<{
    idDocuments: Media[]
    certificates: Media[]
  }>({ idDocuments: [], certificates: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Obtener solicitudes pendientes
  useEffect(() => {
    const fetchPendingRequests = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-profile/pending`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (response.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error al obtener solicitudes pendientes')
        }

        const data = await response.json()
        setRequests(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching pending requests:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPendingRequests()
  }, [router])

  // Cargar documentos cuando se selecciona una solicitud
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedRequest) return

      setIsLoadingDocuments(true)
      setError(null)

      try {
        const [idDocsResponse, certsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/id-documents/${selectedRequest.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/certificates/${selectedRequest.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          })
        ])

        if (!idDocsResponse.ok || !certsResponse.ok) {
          throw new Error('Error al cargar documentos')
        }

        const idDocuments = await idDocsResponse.json()
        const certificates = await certsResponse.json()

        setDocuments({
          idDocuments,
          certificates
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar documentos')
        console.error('Error loading documents:', err)
      } finally {
        setIsLoadingDocuments(false)
      }
    }

    fetchDocuments()
  }, [selectedRequest])

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedRequest) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [selectedRequest])

  const handleStatusUpdate = async (status: 'active' | 'rejected') => {
    if (!selectedRequest) return
    
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = status === 'active' 
        ? 'status-active' 
        : 'status-rejected'

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service-profile/${endpoint}/${selectedRequest.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error al ${status === 'active' ? 'aprobar' : 'rechazar'} la solicitud`)
      }

      // Actualizar el estado localmente
      setRequests(requests.filter(req => req.id !== selectedRequest.id))
      setSelectedRequest(null)
      alert(`Solicitud ${status === 'active' ? 'aprobada' : 'rechazada'} correctamente`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error updating request status:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (address: Address) => {
    return `${address.street} ${address.extNumber}${address.intNumber ? ` Int ${address.intNumber}` : ''}, ${address.neighborhood ? `${address.neighborhood}, ` : ''}${address.city}, ${address.state}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-1 flex-col gap-2">
      <h2 className="text-xl font-bold pb-4 text-gray-800 dark:text-white">Solicitudes Pendientes</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-8">
        Usuarios que solicitan convertirse en proveedores de servicios. Revisa y aprueba sus solicitudes.
      </p>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading && requests.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No hay solicitudes pendientes en este momento.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto px-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent' }}>
          <div className="flex space-x-4 pb-2">
            {requests.map((req) => (
              <div
                key={req.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 flex flex-col justify-between w-[250px] shrink-0"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{req.user?.name || req.userName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{req.serviceTitle}</p>
                  <p className="text-sm mt-2 text-gray-800 dark:text-gray-300">
                    {req.category?.name}
                  </p>
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="text-blue-600 dark:text-blue-400 hover:underline mt-2 self-start"
                  onClick={() => setSelectedRequest(req)}
                  disabled={isLoading}
                >
                  Revisar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              onClick={() => !isLoading && setSelectedRequest(null)}
              disabled={isLoading}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Detalles de la Solicitud
            </h3>

            <div className="space-y-4 text-gray-800 dark:text-white">
              <div className="flex items-start gap-4">
                <Image
                  src={selectedRequest.user?.imgUrl}
                  alt={selectedRequest.user?.name || selectedRequest.userName}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">{selectedRequest.user?.name || selectedRequest.userName}</p>
                  <p className="text-gray-600 dark:text-gray-400">{selectedRequest.user?.email}</p>
                  <p className="text-sm mt-1">{selectedRequest.user?.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Título del servicio:</strong> {selectedRequest.serviceTitle}</p>
                  <p><strong>Descripción:</strong> {selectedRequest.description}</p>
                  <p><strong>Categoría:</strong> {selectedRequest.category?.name}</p>
                </div>
                <div>
                  <p><strong>Precio por cita:</strong> ${selectedRequest.appointmentPrice}</p>
                  <p><strong>Teléfono:</strong> {selectedRequest.phone}</p>
                  <p><strong>Dirección:</strong> {formatAddress(selectedRequest.address)}</p>
                </div>
              </div>

              {/* Sección de Documentos de Identidad */}
              <div className="mt-6">
                <h4 className="font-bold mb-3">Documentos de Identidad</h4>
                {isLoadingDocuments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : documents.idDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {documents.idDocuments.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-3">
                        <div className="relative w-full h-48">
                          <Image
                            src={doc.imgUrl}
                            alt="Documento de identidad"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
                          {doc.type === 'id_document' ? 'Documento de Identidad' : 'Documento'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No hay documentos de identidad cargados</p>
                )}
              </div>

              {/* Sección de Certificados */}
              <div className="mt-6">
                <h4 className="font-bold mb-3">Certificados</h4>
                {isLoadingDocuments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : documents.certificates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {documents.certificates.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-3">
                        <div className="relative w-full h-48">
                          <Image
                            src={cert.imgUrl}
                            alt="Certificado"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
                          Certificado profesional
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No hay certificados cargados</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLoading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isLoading ? 'Procesando...' : 'Rechazar'}
              </button>
              <button
                onClick={() => handleStatusUpdate('active')}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isLoading ? 'Procesando...' : 'Aprobar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PendingRequests