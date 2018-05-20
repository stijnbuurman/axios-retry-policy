import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { axiosNetworkErrorDetectionStrategy } from '../../src';

chai.use(chaiAsPromised);
const assert = chai.assert;

describe('AxiosNetworkErrorDetectionStrategy', () => {
  it('should recognize network errors', () => {
    const strategy = axiosNetworkErrorDetectionStrategy();
    assert.equal(strategy(new Error('Network Error')), true);
  });

  it('should not recognize other errors', () => {
    const strategy = axiosNetworkErrorDetectionStrategy();
    assert.equal(strategy(new Error()), false);
    assert.equal(strategy(new RangeError()), false);
  });
});
