import { createRoot } from 'react-dom/client'
import { ApplicationContextProvider } from './contexts/ApplicationContext.js';
import './styles.css'
import App from './App'

createRoot(document.getElementById('root')).render(
    <div>
        <ApplicationContextProvider>
            <App />
        </ApplicationContextProvider>
    </div>
);
