// Polyfill new ES features
import 'babel-polyfill'
// Setup enviroment variables
import './env'

// Start to watch the ticker and perform actions
import './actionsLogic'
// Import the express app
import app from './app'

// Start listening for requests
const PORT = 9000
app.listen(PORT, () => console.info(`Server listening on PORT ${PORT}...`))
