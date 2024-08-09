import React, { Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useContext } from 'react'
import { OnlineContext } from './Provider/OrderProvider'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import router from './router/Routing'
import { RouterProvider } from 'react-router-dom'

const App = () => {
  const{auths} = useContext(OnlineContext);
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>


      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <RouterProvider router={router} />
         {/* <Route path="*" name="Home" element={<DefaultLayout />} /> */}
          {/* <Route exact path="/login" name="Login Page" element={<Login/>} />  */}
    
         
         
      
      </Suspense>
    </>
  
  )
}

export default App
