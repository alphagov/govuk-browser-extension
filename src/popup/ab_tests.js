var Popup = Popup || {};

Popup.findActiveAbTests = function(abTestBuckets) {
  return Object.keys(abTestBuckets).map(function (abTestName) {

    var currentBucket = abTestBuckets[abTestName].currentBucket;
    var allowedBuckets = abTestBuckets[abTestName].allowedBuckets;

    return {
      testName: abTestName,
      buckets: allowedBuckets.map(function (bucketName) {
        return {
          bucketName: bucketName,
          class: currentBucket === bucketName ? "ab-bucket-selected" : ""
        };
      })
    }
  });
};
