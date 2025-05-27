"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

interface NGO {
  _id: string
  name: string
  email: string
  phone: string
  city: string
  registrationNumber: string
}

interface NGOAuthContextType {
  ngo: NGO | null,
  login: (email: string, password: string) => Promise<boolean>
  signup: (ngoData: Omit<NGO, "_id"> & { password: string }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const NGOAuthContext = createContext<NGOAuthContextType | undefined>(undefined)

export function NGOAuthProvider({ children }: { children: ReactNode }) {
  const [ngo, setNGO] = useState<NGO | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // On mount, check for token
  useEffect(() => {
    const token = localStorage.getItem("ngo_token")
    if (token) {
      const decoded = jwtDecode<NGO>(token)
      setNGO(decoded)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/ngo/login", { email, password })
      if (res.data.token) {
        localStorage.setItem("ngo_token", res.data.token)
        const decoded = jwtDecode<NGO>(res.data.token)
        setNGO(decoded)
        setIsLoading(false)
        return true
      }
    } catch (err: any) {
      setIsLoading(false)
      throw err.response?.data?.error || "Login failed"
    }
    setIsLoading(false)
    return false
  }

  const signup = async (ngoData: Omit<NGO, "_id"> & { password: string }): Promise<boolean> => {
    setIsLoading(true)
    try {
      await axios.post("http://localhost:8000/ngo/signup", ngoData)
      setIsLoading(false)
      return true
    } catch (err: any) {
      setIsLoading(false)
      throw err.response?.data?.error || "Signup failed"
    }
  }

  const logout = () => {
    localStorage.removeItem("ngo_token")
    setNGO(null)
  }

  return (
    <NGOAuthContext.Provider value={{ ngo, login, signup, logout, isLoading }}>
      {children}
    </NGOAuthContext.Provider>
  )
}

export function useNGOAuth() {
  const context = useContext(NGOAuthContext)
  if (context === undefined) {
    throw new Error("useNGOAuth must be used within a NGOAuthProvider")
  }
  return context
}