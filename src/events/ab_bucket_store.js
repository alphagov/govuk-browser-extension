// This script is executed in the background.
//
// It stores the environment-specific state of the user's A/B testing buckets in
// memory, until the browser or the extension is next reloaded.
var abBucketStore = (function () {
  function createStore() {
    var abTestBuckets = {};

    function addAbTests(initialBuckets) {
      Object.keys(initialBuckets).map(function (testName) {
        // Add any A/B tests that are not already defined, but do not overwrite
        // any that we are already tracking.
        if (!abTestBuckets[testName]) {
          abTestBuckets[testName] = initialBuckets[testName];
        }
      });
    }

    function getAll() {
      return abTestBuckets;
    }

    function setBucket(testName, bucket) {
      abTestBuckets[testName] = bucket;
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
}());
