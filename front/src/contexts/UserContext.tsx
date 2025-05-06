// src/context/UserContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type UserContextType = {
  usersUpdated: boolean
  triggerUsersUpdate: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [usersUpdated, setUsersUpdated] = useState(false)

  const triggerUsersUpdate = () => {
    setUsersUpdated(prev => !prev) // Alternar el estado para forzar actualización
  }

  return (
    <UserContext.Provider value={{ usersUpdated, triggerUsersUpdate }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}