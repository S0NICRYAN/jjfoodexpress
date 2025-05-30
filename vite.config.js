export default {
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
    sourcemap: true
  }
} 