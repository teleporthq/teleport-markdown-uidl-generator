import { markdown } from './mock'

import { markdownUIDLGenerator } from '../src'

const run = () => {
  try {
    const start = process.hrtime.bigint()
    const parser = markdownUIDLGenerator()
    parser.parse(markdown)
    const end = process.hrtime.bigint()
    const time = Math.round(Number(end - start) / 1e6)
    console.log(`Time elapsed is ${time}ms for cold start`)
  } catch (e) {
    console.error(e)
  }

  try {
    let warmRuns = 0
    const parser = markdownUIDLGenerator()
    for (let i = 0; i < 10; i++) {
      const start = process.hrtime.bigint()
      parser.parse(markdown)
      const end = process.hrtime.bigint()
      const time = Math.round(Number(end - start) / 1e6)
      console.log(`Time taken for ${i}th run is ${time}`)
      warmRuns = warmRuns + time
    }
    console.log(`Time for average of 10 runs is ${warmRuns / 10}`)
  } catch (e) {
    console.error(e)
  }
}

run()
