import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
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
