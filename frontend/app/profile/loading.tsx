import React from 'react'

export default function ProfileLoading({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      Loading profile
      {children}
    </div>
  )
}
