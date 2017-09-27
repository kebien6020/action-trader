import path from 'path'
import dotenv from 'dotenv'

const dotenvFiles = [
  '../../.env.local',
  '../../.env'
].map(filename => path.resolve(__dirname, filename))

for (const file of dotenvFiles) {
  console.log('Loading environment variables from ', file)
  dotenv.config({path: file})
}
