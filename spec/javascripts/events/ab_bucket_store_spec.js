describe("abBucketStore", function () {
  it("is initialized empty if no bucket are provided", function () {
    var store = abBucketStore.createStore();

    expect(store.getAll()).toEqual({});
  });

  describe("addAbTests", function () {
    it("does nothing if no tests are added to an already-empty store", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({});

      expect(store.getAll()).toEqual({});
    });

    it("adds tests to empty store", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({
        testName1: "bucket1",
        testName2: "bucket2"
      });

      expect(store.getAll()).toEqual({
        testName1: "bucket1",
        testName2: "bucket2"
      });
    });

    it("appends new tests", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({
        originalTest1: "originalBucket1",
        originalTest2: "originalBucket2"
      });

      store.addAbTests({
        originalTest1: "updatedBucket1",
        newTest1: "newBucket1",
        originalTest2: "updatedBucket2",
        newTest2: "newBucket2"
      });

      expect(store.getAll()).toEqual({
        originalTest1: "originalBucket1",
        originalTest2: "originalBucket2",
        newTest1: "newBucket1",
        newTest2: "newBucket2"
      });
    });
  });

  describe("setBucket", function() {
    it("updates value of existing bucket", function () {
      var store = abBucketStore.createStore();
      store.addAbTests({
        testName1: "originalBucket1",
        testName2: "originalBucket2"
      });

      store.setBucket("testName1", "updatedBucket");

      expect(store.getAll()).toEqual({
        testName1: "updatedBucket",
        testName2: "originalBucket2"
      });
    });
  });
});
