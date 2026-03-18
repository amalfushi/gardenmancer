import { seedDatabase } from '../src/lib/seed'

const force = process.argv.includes('--force')

seedDatabase({ force })
  .then(() => console.log('Done'))
  .catch(console.error)
