import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  define:{
    'process.env.VITE_SUBGRAPH_URL':JSON.stringify(process.env.VITE_SUBGRAPH_URL),
    __APP_ENV__: process.env.VITE_ETHERSCAN_API_KEY,
  }
})
