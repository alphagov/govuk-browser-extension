describe("abBucketStore", function () {
  it("is initialized empty", function () {
    var store = abBucketStore.createStore();

    expect(store.getAll()).toEqual({});
  });

  describe("addAbTests", function () {
    it("does nothing if no tests are added to an already-empty store", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({}, "example.com");

      expect(store.getAll("example.com")).toEqual({});
    });

    it("adds tests to empty store", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({
        testName1: "bucket1",
        testName2: "bucket2"
      }, "example.com");

      expect(store.getAll("example.com")).toEqual({
        testName1: "bucket1",
        testName2: "bucket2"
      });
    });

    it("appends new tests", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({
        originalTest1: "originalBucket1",
        originalTest2: "originalBucket2"
      }, "example.com");

      store.addAbTests({
        originalTest1: "updatedBucket1",
        newTest1: "newBucket1",
        originalTest2: "updatedBucket2",
        newTest2: "newBucket2"
      }, "example.com");

      expect(store.getAll("example.com")).toEqual({
        originalTest1: "originalBucket1",
        originalTest2: "originalBucket2",
        newTest1: "newBucket1",
        newTest2: "newBucket2"
      });
    });

    it("stores A/B tests by domain name", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({
        integrationAbTest: "bucketOnInt",
      }, "www-origin.integration.publishing.service.gov.uk");
      store.addAbTests({
        productionAbTest: "bucketOnProd",
      }, "www.gov.uk");

      expect(store.getAll("www-origin.integration.publishing.service.gov.uk")).toEqual({
        integrationAbTest: "bucketOnInt",
      });
      expect(store.getAll("www.gov.uk")).toEqual({
        productionAbTest: "bucketOnProd",
      });
    });
  });

  describe("getAll", function () {
    it("returns no A/B tests if none have been stored for that domain", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({
        someAbTest: "someBucket",
      }, "www.gov.uk");

      expect(store.getAll("example.com")).toEqual({});
    });
  });

  describe("setBucket", function () {
    it("updates value of existing bucket", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({
        testName1: "originalBucket1",
        testName2: "originalBucket2"
      }, "example.com");

      store.setBucket("testName1", "updatedBucket", "example.com");

      expect(store.getAll("example.com")).toEqual({
        testName1: "updatedBucket",
        testName2: "originalBucket2"
      });
    });

    it("updates bucket with matching domain name", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({
        abTestName: "originalBucket",
      }, "www-origin.integration.publishing.service.gov.uk");
      store.addAbTests({
        abTestName: "originalBucket",
      }, "www.gov.uk");

      store.setBucket("abTestName", "updatedBucket", "www.gov.uk");

      expect(store.getAll("www-origin.integration.publishing.service.gov.uk")).toEqual({
        abTestName: "originalBucket",
      });
      expect(store.getAll("www.gov.uk")).toEqual({
        abTestName: "updatedBucket",
      });
    });
  });
});
