import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { createRoot } from 'react-dom/client'
import { initializeAuth } from './features/auth/authSlice.js'
import './index.css'
import App from './App.jsx'

// Initialize auth state from localStorage on app load
store.dispatch(initializeAuth())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
