"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type DAppFilterContextType = {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const DAppFilterContext = createContext<DAppFilterContextType | undefined>(undefined)

export function DAppFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <DAppFilterContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </DAppFilterContext.Provider>
  )
}

export function useDAppFilter() {
  const context = useContext(DAppFilterContext)
  if (context === undefined) {
    throw new Error("useDAppFilter must be used within a DAppFilterProvider")
  }
  return context
}



