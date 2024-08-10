import { createRoot } from 'react-dom/client'
import { SessionContextProvider } from './contexts/SessionContext';
import './styles.css'
import App from './App'


createRoot(document.getElementById('root')).render(
    <div>
        <SessionContextProvider>
            <App />
        </SessionContextProvider>
    </div>
);
