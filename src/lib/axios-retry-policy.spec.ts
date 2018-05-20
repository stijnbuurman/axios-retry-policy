import {
  afterAttemptStopStrategy,
  genericErrorDetectionStrategy,
  linearWaitStrategy
} from '@stinoz/retry-policy';
import { test } from 'ava';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { axiosRetryPolicy } from './axios-retry-policy';

test('axiosRetryAdapterFailOnce', t => {
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
    t.is(4, 4);
  });
});

test('axiosRetryAdapterNonTransient', t => {
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
      t.fail();
    })
    .catch(() => {
      t.is(4, 4);
    });
});
