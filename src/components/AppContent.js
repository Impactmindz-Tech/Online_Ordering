import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import AppRoutes from '../routes'
// routes config

const AppContent = () => {
  return (
    <CContainer fluid className="px-4" >
      <Suspense fallback={<CSpinner color="primary" />}>
      <AppRoutes />
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
