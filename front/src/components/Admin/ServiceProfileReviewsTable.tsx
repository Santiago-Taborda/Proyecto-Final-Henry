'use client'
import React, { useState, useEffect } from 'react'
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
    imgUrl?: string | null
    email: string
  }
}

type ServiceProfile = {
  id: string
  serviceTitle: string
  userName: string
  rating: number | null
  description?: string
  profilePicture?: string | null
  status: string
  category: {
    name: string
  }
  reviews: Review[]
  createdAt: string
  deletedAt: string | null
}

const ITEMS_PER_PAGE = 5

const ServiceProfileReviewsTable = () => {
  const [allProfiles, setAllProfiles] = useState<ServiceProfile[]>([])
  const [currentProfiles, setCurrentProfiles] = useState<ServiceProfile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<ServiceProfile | null>(null)
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({})
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const router = useRouter()

  const fetchServiceProfiles = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service-profile/active`,
        { 
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          } 
        }
      )

      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const profiles = await response.json()
      setAllProfiles(profiles)
      updatePaginatedProfiles(profiles, 1)

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error desconocido al cargar perfiles de servicio')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updatePaginatedProfiles = (profiles: ServiceProfile[], page: number) => {
    const totalPages = Math.ceil(profiles.length / ITEMS_PER_PAGE)
    setTotalPages(totalPages > 0 ? totalPages : 1)
    setCurrentPage(page > totalPages ? 1 : page)

    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const paginatedProfiles = profiles.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    setCurrentProfiles(paginatedProfiles)
  }

  const toggleReviews = (profileId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [profileId]: !prev[profileId]
    }))
  }

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingReviewId(reviewId)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
        { 
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      setSuccess('Review eliminado permanentemente')
      
      // Actualización optimista
      setAllProfiles(prevProfiles => 
        prevProfiles.map(profile => ({
          ...profile,
          reviews: profile.reviews.filter(review => review.id !== reviewId)
        }))
      )
      
      updatePaginatedProfiles(allProfiles, currentPage)

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error al eliminar el review')
      }
    } finally {
      setDeletingReviewId(null)
      setTimeout(fetchServiceProfiles, 1000)
    }
  }

  useEffect(() => {
    fetchServiceProfiles()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Gestión de Reviews</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Administra reviews de perfiles de servicio
      </p>

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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Perfil de Servicio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reviews</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentProfiles.length > 0 ? (
              currentProfiles.map((profile) => (
                <React.Fragment key={profile.id}>
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {profile.profilePicture ? (
                          <Image 
                            src={profile.profilePicture}
                            width={32}
                            height={32}
                            className="rounded-full"
                            alt={`Avatar de ${profile.userName}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/default-avatar.png'
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {profile.userName?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {profile.serviceTitle}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {profile.userName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {profile.category?.name || 'Sin categoría'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {profile.rating !== null ? renderStars(Math.round(profile.rating)) : 'Sin rating'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {profile.reviews?.length || 0}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleReviews(profile.id)}
                        className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {expandedReviews[profile.id] ? 'Ocultar' : 'Ver'} Reviews
                      </button>
                    </td>
                  </tr>
                  {expandedReviews[profile.id] && profile.reviews?.length > 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 bg-gray-50 dark:bg-gray-700">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 dark:text-white">Reviews:</h4>
                          {profile.reviews.map((review) => (
                            <div key={review.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                  {review.user.imgUrl ? (
                                    <Image 
                                      src={review.user.imgUrl}
                                      width={24}
                                      height={24}
                                      className="rounded-full"
                                      alt={`Avatar de ${review.user.name}`}
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                      <span className="text-xs font-medium text-gray-600">
                                        {review.user.name?.charAt(0).toUpperCase() || '?'}
                                      </span>
                                    </div>
                                  )}
                                  <p className="font-medium text-gray-800 dark:text-white">
                                    {review.user.name}
                                  </p>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(review.createdAt)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  disabled={deletingReviewId === review.id}
                                  className={`px-2 py-1 text-xs rounded-md ${
                                    deletingReviewId === review.id 
                                      ? 'bg-gray-400 text-white' 
                                      : 'bg-red-600 hover:bg-red-700 text-white'
                                  }`}
                                >
                                  {deletingReviewId === review.id ? 'Eliminando...' : 'Eliminar'}
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                {renderStars(review.rating)}
                                <span className="text-sm font-medium text-gray-800 dark:text-white">
                                  {review.rating}.0
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                  {isLoading ? 'Cargando perfiles...' : 'No se encontraron perfiles de servicio'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => updatePaginatedProfiles(allProfiles, currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 text-gray-800 dark:text-white"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => updatePaginatedProfiles(allProfiles, currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 text-gray-800 dark:text-white"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

export default ServiceProfileReviewsTable