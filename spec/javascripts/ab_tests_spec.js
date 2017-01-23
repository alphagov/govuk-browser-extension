describe("Popup.findActiveAbTests", function () {
  it("returns no A/B tests if none are active", function () {
    var abTests = Popup.findActiveAbTests({});

    expect(abTests).toEqual([]);
  });

  it("finds all A/B tests", function () {
    var abTests = Popup.findActiveAbTests({
      "first-AB-test-name": "some-value",
      "second-AB-test-name": "other-value",
      "third-AB-test-name": "yet-another-value",
    });

    expect(abTests.length).toEqual(3);
    expect(abTests[0].testName).toEqual("first-AB-test-name");
    expect(abTests[1].testName).toEqual("second-AB-test-name");
    expect(abTests[2].testName).toEqual("third-AB-test-name");
  });

  it("returns A and B buckets", function () {
    var abTests = Popup.findActiveAbTests({
      "some-AB-test-name": "some-value"
    });

    expect(abTests[0].buckets.length).toEqual(2);
    expect(abTests[0].buckets[0].bucketName).toEqual("A");
    expect(abTests[0].buckets[1].bucketName).toEqual("B");
  });

  it("highlights 'A' bucket if user is in 'A' group", function () {
    var abTests = Popup.findActiveAbTests({
      "some-AB-test-name": "B",
      "other-AB-test-name": "A"
    });

    expect(abTests[0].buckets[0].class).toEqual("");
    expect(abTests[0].buckets[1].class).toEqual("ab-bucket-selected");

    expect(abTests[1].buckets[0].class).toEqual("ab-bucket-selected");
    expect(abTests[1].buckets[1].class).toEqual("");
  });

  it("doesn't highlight any buckets if variant is unknown", function () {
    var abTests = Popup.findActiveAbTests({
      "some-AB-test-name": "some-unknown-bucket"
    });

    expect(abTests[0].buckets[0].class).toEqual("");
    expect(abTests[0].buckets[1].class).toEqual("");
  });
});
