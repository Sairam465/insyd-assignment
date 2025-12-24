import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import styles from './layout.module.css'

export const metadata: Metadata = {
  title: 'Insyd Inventory',
  description: 'Inventory Management System for AEC Businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  )
}
