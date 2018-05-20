import {
  afterAttemptStopStrategy,
  genericErrorDetectionStrategy,
  linearWaitStrategy
} from '@stinoz/retry-policy';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { axiosRetryPolicy } from '../../src';

chai.use(chaiAsPromised);
const assert = chai.assert;

describe('AxiosRetryPolicy', () => {
  it('should fail once and than give a response', () => {
    const mock = new MockAdapter(axios);
    mock
      .onGet('/test')
      .replyOnce(500)
      .onGet('/test')
      .replyOnce(200);

    axiosRetryPolicy(axios, {
      stopStrategy: afterAttemptStopStrategy({ attempts: 5 }),
      waitStrategy: linearWaitStrategy({ timeout: 100 })
    });

    return axios.get('/test').then(() => {
      assert.ok(true);
    });
  });

  it('should fail on a non transient error', () => {
    const mock = new MockAdapter(axios);
    mock
      .onGet('/test')
      .replyOnce(500)
      .onGet('/test')
      .replyOnce(200);

    axiosRetryPolicy(axios, {
      errorDetectionStrategies: [
        genericErrorDetectionStrategy({ errors: [RangeError] })
      ],
      stopStrategy: afterAttemptStopStrategy({ attempts: 5 }),
      waitStrategy: linearWaitStrategy({ timeout: 100 })
    });

    return axios
      .get('/test')
      .then(() => {
        assert.fail();
      })
      .catch(() => {
        assert.ok(true);
      });
  });
});
