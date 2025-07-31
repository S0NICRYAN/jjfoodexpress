import { defineConfig } from 'vite'

export default defineConfig({
  // Enable environment variable loading
  envPrefix: 'VITE_',
  
  // Configure server options
  server: {
    port: 3000,
    open: true
  },
  
  // Configure build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        order: 'order.html',
        inventory: 'inventory.html',
        preview: 'preview.html',
        history: 'history.html',
        outlet_management: 'outlet_management.html',
        order_management:'order_management.html',
        soa:'soa.html',
        product:'product.html',
        delivery:'delivery.html',
        migrate_images:'migrate_images.html',
        attendance:'attendance.html',
        employee:'employee.html'
      }
    }
  }
}) 