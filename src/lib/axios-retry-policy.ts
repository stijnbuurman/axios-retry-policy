import {
  GetWaitTime,
  IsRetryable,
  IsStopped,
  RetryPolicy,
  RetryState
} from '@stinoz/retry-policy';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

type RetryPolicyAxiosError = AxiosError & {
  config: { retryState?: RetryState };
};

export function axiosRetryPolicy(
  axiosInstance: AxiosInstance,
  retryPolicyOptions?: {
    readonly errorDetectionStrategies?: ReadonlyArray<IsRetryable>;
    readonly stopStrategy?: IsStopped;
    readonly waitStrategy?: GetWaitTime;
  }
) {
  const retryPolicy = RetryPolicy(retryPolicyOptions);
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      return response;
    },
    (error: RetryPolicyAxiosError) => {
      return retryPolicy(error, error.config.retryState).then(
        (retryState: RetryState) => {
          const config = { ...error.config, retryState };
          return axiosInstance.request(config);
        }
      );
    }
  );
}
