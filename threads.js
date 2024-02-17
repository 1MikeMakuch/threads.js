//

// Mike Makuch 2024/02/17
// Finally trying out Node's worker threads. And as a bonus show how this example of CPU bound tasks are not helped
// by Hyperthreading.

const worker_threads = require('worker_threads')

let NUM_ITERATIONS = 1_000_000_000

const isParent = process.argv.reduce((acc, arg) => acc && !arg.match(/isAWorkerThread/), true)

// main
;(async function main() {
  if (isParent) {
    console.log('Continue?')
    // pause so you can find the pid and watch with top
    await waitKey()
    await parent()
  } else {
    const workerIdNumber = process.argv[3]
    worker(workerIdNumber)
  }
})()

// wait for a key press
async function waitKey() {
  const readline = require('readline')
  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  await new Promise(resolve => {
    process.stdin.on('keypress', (str, key) => {
      console.log()
      process.stdin.setRawMode(false)
      resolve()
    })
  })
}

// worker function, does a little math to busy the CPU(s)
function worker(workerId) {
  const numIterations = parseInt(NUM_ITERATIONS / worker_threads.workerData.thread_count)
  for (let i = 0; i < numIterations; i++) {
    const n = Math.random() * Math.random()
  }
  worker_threads.parentPort.postMessage(workerId)
}

// main thread
async function parent() {
  //

  function createWorker(ThreadCount) {
    return new Promise(function (resolve, reject) {
      const workerIdNumber = Date.now()
      const worker = new worker_threads.Worker(__filename, {
        argv: ['isAWorkerThread', workerIdNumber],
        workerData: {thread_count: ThreadCount}
      })
      worker.on('message', data => {
        if (workerIdNumber == data) {
          resolve(data)
        }
      })
      worker.on('error', msg => {
        reject(`An error ocurred: ${msg}`)
      })
    })
  }

  // run the same task for 1 thru 10 threads so we can see
  // when additional threads pay off and when they don't

  for (let numThreads = 1; numThreads < 10; numThreads++) {
    const start = Date.now()
    const workerPromises = []
    for (let threadNum = 0; threadNum < numThreads; threadNum++) {
      workerPromises.push(createWorker(numThreads))
    }
    let results
    try {
      results = await Promise.all(workerPromises)
    } catch (error) {
      console.error('parent:', error)
    }
    const end = Date.now()
    const duration = end - start
    const total = results.reduce((acc, val) => acc + val, 0)
    console.log('numThreads', numThreads, 'time =', duration)
  }

  await sleep(1000)
  process.exit()
}

async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, 1000))
}
