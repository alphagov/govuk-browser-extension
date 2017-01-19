var Popup = Popup || {};

Popup.findActiveAbTests = function(abTestBuckets) {
  const buckets = ["A", "B"];

  return Object.keys(abTestBuckets).map(function (abTestName) {

    var currentBucket = abTestBuckets[abTestName];

    return {
      name: abTestName,
      buckets: buckets.map(function (bucketName) {
        return {
          name: bucketName,
          class: currentBucket === bucketName ? "ab-bucket-selected" : ""
        };
      })
    }
  });
};
