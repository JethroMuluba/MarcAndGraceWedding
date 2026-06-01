import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Playfair_Display } from 'next/font/google'
import ScrollToTop from '@/components/ScrollToTop'


const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
})




export const metadata: Metadata = {
  title: "Mariage de Marc et Grâce",
  description:
    "Aujourd'hui, nous unissons nos cœurs pour la vie, et c'est avec émotion que vous assistez à la naissance d'un nouveau chapitre plein d'amour, de complicité et de promesses.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={playfairDisplay.className}>
      <body>
        
          {children}
        
        <ScrollToTop />
      </body>
    </html>
  )
}

