'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Review = {
  id: string
  rating: number
  comment: string
  createdAt: string
  deletedAt: string | null
  user: {
    id: string
    name: string
    imgUrl: string
  }
  serviceProfile: {
    id: string
    serviceTitle: string
  }
  appointment?: {
    id: string
    date: string
  }
}

type ServiceProfile = {
  id: string
  serviceTitle: string
  userName: string
  rating: number | null
  description?: string
  user: {
    id: string
    name: string
  }
}

const ReviewSearchModalBlock = () => {
  const [serviceProfileId, setServiceProfileId] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serviceProfileInfo, setServiceProfileInfo] = useState<ServiceProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSearch = async () => {
    if (!serviceProfileId.trim()) {
      setError('Por favor ingresa un ID de perfil de servicio')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/service-profile/${serviceProfileId}`,
        {
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
        throw new Error(response.status === 404 
          ? 'Perfil de servicio no encontrado' 
          : 'Error al obtener los reviews')
      }

      const reviewsData = await response.json()

      const formattedReviews = reviewsData.map((review: Review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        deletedAt: review.deletedAt,
        user: {
          id: review.user?.id,
          name: review.user?.name || 'Usuario anónimo',
          imgUrl: review.user?.imgUrl || '/default-avatar.png'
        },
        serviceProfile: {
          id: review.serviceProfile?.id,
          serviceTitle: review.serviceProfile?.serviceTitle
        },
        ...(review.appointment && {
          appointment: {
            id: review.appointment.id,
            date: review.appointment.date
          }
        })
      }))

      if (reviewsData.length > 0 && reviewsData[0].serviceProfile) {
        setServiceProfileInfo({
          id: reviewsData[0].serviceProfile.id,
          serviceTitle: reviewsData[0].serviceProfile.serviceTitle,
          userName: reviewsData[0].serviceProfile.user?.name || 'Nombre no disponible',
          rating: reviewsData[0].serviceProfile.rating,
          description: reviewsData[0].serviceProfile.description,
          user: {
            id: reviewsData[0].serviceProfile.user?.id,
            name: reviewsData[0].serviceProfile.user?.name
          }
        })
      }

      setReviews(formattedReviews)
      setShowResultsModal(true)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error buscando reviews')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReview = (review: Review) => {
    if (review.deletedAt) return // No permitir desactivar un review ya desactivado
    setSelectedReview(review)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedReview || selectedReview.deletedAt) return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/softDelete/${selectedReview.id}`,
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
        throw new Error(`Error ${response.status}: No se pudo desactivar el review`)
      }

      // Actualizar el review localmente con la fecha de desactivación
      setReviews(reviews.map(review => 
        review.id === selectedReview.id 
          ? { ...review, deletedAt: new Date().toISOString() } 
          : review
      ))
      
      setSelectedReview(null)
      setShowDeleteModal(false)
      alert('Review desactivado correctamente')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desactivar review')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Buscar Reviews por Perfil de Servicio</h2>
      
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ID del Perfil de Servicio
          </label>
          <input
            type="text"
            placeholder='Ingresa el ID del perfil de servicio'
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            value={serviceProfileId}
            onChange={(e) => {
              setServiceProfileId(e.target.value)
              setError(null)
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'} text-white h-[42px]`}
        >
          {isLoading ? 'Buscando...' : 'Buscar Reviews'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Modal de resultados */}
      {showResultsModal && serviceProfileInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {serviceProfileInfo.serviceTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {serviceProfileInfo.userName} • Rating: {serviceProfileInfo.rating?.toFixed(1) || 'N/A'}/5
                </p>
                {serviceProfileInfo.description && (
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                    {serviceProfileInfo.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowResultsModal(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Reviews ({reviews.length})
              </h4>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className={`border rounded-lg p-4 transition-shadow ${
                        review.deletedAt 
                          ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50' 
                          : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Image
                          src={review.user.imgUrl}
                          alt={review.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {review.user.name}
                                </p>
                                {review.deletedAt && (
                                  <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                                    Desactivado
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i}
                                    className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteReview(review)}
                              disabled={review.deletedAt !== null}
                              className={`p-1 ${review.deletedAt !== null 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-500 hover:text-red-700 dark:hover:text-red-400'}`}
                              title={review.deletedAt !== null ? 'Review ya desactivado' : 'Desactivar review'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          
                          <p className={`mt-3 ${review.deletedAt ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'} italic`}>
                          &quot;{review.comment}&quot;
                          </p>
                          
                          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <p>
                              Fecha: {new Date(review.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {review.appointment && (
                              <p>Cita ID: {review.appointment.id}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Este perfil de servicio no tiene reviews aún.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowResultsModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de desactivación */}
      {showDeleteModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Desactivar Review
            </h3>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={selectedReview.user.imgUrl}
                  alt={selectedReview.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{selectedReview.user.name}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i}
                        className={`${i < selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">
              &quot;{selectedReview.comment}&quot;
              </p>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro que deseas desactivar este review? El review no se mostrará públicamente pero permanecerá en el sistema.
            </p>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLoading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                } transition-colors`}
              >
                {isLoading ? 'Desactivando...' : 'Confirmar Desactivación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewSearchModalBlock