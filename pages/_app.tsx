import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { AuthUserProvider } from '../components/AuthStateContext';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/styles.css'
import '../styles/fonts.css';


export default function App({ Component, pageProps }: AppProps) {

  return (<AuthUserProvider>
    <Component {...pageProps} />
    <ToastContainer theme="colored" pauseOnHover={false} />
  </AuthUserProvider>)
}

