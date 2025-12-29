// This module handles server startup, error handling, and graceful shutdown.
// It exports a single function to start the Express server and sets up process event listeners.

let serverInstance = null // Reference to the running server (used for graceful shutdown)

/**
 * Starts the Express server and sets up global error/shutdown handlers.
 * @param {Express} app - The Express application instance
 * @param {number} port - The port number to listen on
 */
export function startServer(app, port) {
  // Start the HTTP server
  serverInstance = app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })

  // Handle unhandled promise rejections (e.g., async errors not caught)
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
    gracefulShutdown(1) // Exit with error code
  })

  // Handle uncaught exceptions (synchronous errors that crash the process)
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    gracefulShutdown(1) // Exit with error code
  })

  // Graceful shutdown on SIGTERM (sent by Docker, PM2, Kubernetes, etc.)
  process.on('SIGTERM', () => gracefulShutdown(0))

  // Graceful shutdown on SIGINT (Ctrl+C in terminal during development)
  process.on('SIGINT', () => gracefulShutdown(0))
}

/**
 * Performs a clean shutdown: closes the server and disconnects the database.
 * @param {number} [exitCode=0] - Exit code (0 = success, 1 = error)
 */
async function gracefulShutdown(exitCode = 0) {
  console.log('Shutting down gracefully...')

  try {
    // Close the HTTP server first (stop accepting new connections)
    if (serverInstance)
      await new Promise((resolve) => {
        serverInstance.close(() => {
          console.log('HTTP server closed')
          resolve()
        })
      })

    // Dynamically import disconnectDB to avoid circular dependencies
    const { disconnectDB } = await import('../config/db.js')
    await disconnectDB()
    console.log('Database disconnected')
  } catch (err) {
    console.error('Error during shutdown:', err)
    exitCode = 1 // Force error exit if shutdown fails
  }

  // Exit the process cleanly
  process.exit(exitCode)
}
