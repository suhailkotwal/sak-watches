import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)

// Register service worker produced by vite-plugin-pwa when in production
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch((err) => {
			// swallow registration errors in dev
			// eslint-disable-next-line no-console
			console.warn('Service worker registration failed:', err)
		})
	})
}

