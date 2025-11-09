import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  const external = isProd ? ['@jsquash/avif', '@jsquash/webp', '@jsquash/jpeg'] : []
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173
    },
    build: {
      rollupOptions: {
        output: {
          inlineDynamicImports: true
        },
        external
      },
      worker: {
        format: 'es',
        rollupOptions: {
          output: {
            inlineDynamicImports: true
          },
          external
        }
      }
    }
  }
})

