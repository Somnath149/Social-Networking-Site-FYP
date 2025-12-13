import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './redux/store.js'
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { Buffer } from 'buffer'

// window.Buffer = Buffer


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)

// createRoot(document.getElementById('root')).render(
//   <GoogleOAuthProvider clientId="920194726043-i2svtkdd0tocqgvf1q016a2o4e708rau.apps.googleusercontent.com">
//     <BrowserRouter>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </BrowserRouter>
//   </GoogleOAuthProvider>
// );