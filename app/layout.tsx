import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AnesthesiaDose — Clinical Drug Dosage Calculator',
  description: 'Precision anesthesia drug dosage calculator for MD anesthesiologists. Age-sex-weight adjusted dosing for all major anesthetic agents.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
