import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            manifest: {
                name: 'X4 External App',
                short_name: 'X4 External App',
                description: 'External app for X4 Foundations game',
                theme_color: '#2D3035',
                background_color: '#2D3035',
                icons: [
                     {
                         src: '/favicon.ico',
                         sizes: '32x32',
                         type: 'image/ico',
                     },
                     {
                         src: '/x4-logo-192.png',
                         sizes: '192x192',
                         type: 'image/png',
                     },
                ]
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
    server: {
        host: true,
        proxy: {
            '/api': 'http://127.0.0.1:8080',
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                charset: false
            }
        }
    }
})
