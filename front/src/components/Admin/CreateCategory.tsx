'use client'
import React, { useState } from 'react'

const CreateCategoryBlock = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', isError: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ text: '', isError: false })

    try {
      const response = await fetch('https://tecniclick-backend.onrender.com/categories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description })
      })

      if (!response.ok) {
        throw new Error('Error en la solicitud')
      }

      const data = await response.json()
      console.log('Categoría creada:', data)
      setMessage({ text: '✅ Categoría creada exitosamente', isError: false })
      setName('')
      setDescription('')
    } catch (error) {
      console.error('Error:', error)
      setMessage({ text: '❌ Error al crear categoría', isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Crear Categoría</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-md ${
          message.isError 
            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' 
            : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Nombre*
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            placeholder="Ej: Electricista"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Descripción*
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            placeholder="Ej: Profesionales en instalaciones eléctricas"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Enviando...' : 'Crear Categoría'}
        </button>
      </form>
    </div>
  )
}

export default CreateCategoryBlock
