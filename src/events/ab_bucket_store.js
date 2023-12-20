// This script is executed in the background.
//
// It stores the environment-specific state of the user's A/B testing buckets in
// memory, until the browser or the extension is next reloaded.
var abBucketStore = (function () {
  function createStore () {
    var abTestBuckets = {}

    function addAbTests (initialBuckets, hostname) {
      abTestBuckets[hostname] = abTestBuckets[hostname] || {}

      Object.keys(initialBuckets).map(function (testName) {
        // Add any A/B tests that are not already defined, but do not overwrite
        // any that we are already tracking.
        if (!abTestBuckets[hostname][testName]) {
          abTestBuckets[hostname][testName] = initialBuckets[testName]
        }
      })
    }

    function getAll (hostname) {
      return abTestBuckets[hostname] || {}
    }

    function setBucket (testName, bucket, hostname) {
      abTest = abTestBuckets[hostname][testName]
      abTest.currentBucket = bucket
      abTestBuckets[hostname][testName] = abTest
    }

    return {
      addAbTests: addAbTests,
      getAll: getAll,
      setBucket: setBucket
    }
  }

  return {
    createStore: createStore
  }
}())
