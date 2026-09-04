import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)

// Register service worker produced by vite-plugin-pwa in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
	window.addEventListener('load', async () => {
		try {
			const swPath = `${import.meta.env.BASE_URL}sw.js`
			await navigator.serviceWorker.register(swPath)
		} catch (err) {
			// swallow registration errors
			// eslint-disable-next-line no-console
			console.warn('Service worker registration failed:', err)
		}
	})
}

