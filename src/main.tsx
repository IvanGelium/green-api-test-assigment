import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AuthLayout from './components/layouts/AuthLayout'
import Chat from './components/pages/Chat'
import Login from './components/pages/Login'
import './assets/css/index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/chat" replace />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: '*',
        element: <Navigate to="/chat" replace />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
