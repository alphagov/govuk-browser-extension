describe('Popup.findActiveAbTests', function () {
  it('returns no A/B tests if none are active', function () {
    var abTests = Popup.findActiveAbTests({})

    expect(abTests).toEqual([])
  })

  it('finds all A/B tests', function () {
    var abTests = Popup.findActiveAbTests({
      'first-AB-test-name': {
        currentBucket: 'some-value',
        allowedBuckets: ['some-value', 'B']
      },
      'second-AB-test-name': {
        currentBucket: 'other-value',
        allowedBuckets: ['other-value', 'B']
      },
      'third-AB-test-name': {
        currentBucket: 'yet-another-value',
        allowedBuckets: ['A', 'yet-another-value']
      }
    })

    expect(abTests.length).toEqual(3)
    expect(abTests[0].testName).toEqual('first-AB-test-name')
    expect(abTests[1].testName).toEqual('second-AB-test-name')
    expect(abTests[2].testName).toEqual('third-AB-test-name')
  })

  it('returns A and B buckets', function () {
    var abTests = Popup.findActiveAbTests({
      'some-AB-test-name': {
        currentBucket: 'A',
        allowedBuckets: ['A', 'B']
      }
    })

    expect(abTests[0].buckets.length).toEqual(2)
    expect(abTests[0].buckets[0].bucketName).toEqual('A')
    expect(abTests[0].buckets[1].bucketName).toEqual('B')
  })

  it("highlights 'A' bucket if user is in 'A' group", function () {
    var abTests = Popup.findActiveAbTests({
      'some-AB-test-name': {
        currentBucket: 'B',
        allowedBuckets: ['A', 'B']
      },
      'other-AB-test-name': {
        currentBucket: 'A',
        allowedBuckets: ['A', 'B']
      }
    })

    expect(abTests[0].buckets[0].class).toEqual('')
    expect(abTests[0].buckets[1].class).toEqual('ab-bucket-selected')

    expect(abTests[1].buckets[0].class).toEqual('ab-bucket-selected')
    expect(abTests[1].buckets[1].class).toEqual('')
  })

  it("doesn't highlight any buckets if variant is unknown", function () {
    var abTests = Popup.findActiveAbTests({
      'some-AB-test-name': {
        currentBucket: 'Unknown',
        allowedBuckets: ['A', 'B']
      }
    })

    expect(abTests[0].buckets[0].class).toEqual('')
    expect(abTests[0].buckets[1].class).toEqual('')
  })
})
