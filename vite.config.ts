import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return
                    if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react'
                    if (id.includes('@supabase')) return 'vendor-supabase'
                    if (id.includes('@mui') || id.includes('@emotion')) return 'vendor-ui'
                    if (id.includes('@fullcalendar')) return 'vendor-calendar'
                    return 'vendor-misc'
                },
            },
        },
    },
})
