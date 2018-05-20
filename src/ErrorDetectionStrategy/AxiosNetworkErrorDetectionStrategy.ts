import { ErrorDetectionStrategy } from '@stinoz/retry-policy';

export const axiosNetworkErrorDetectionStrategy: ErrorDetectionStrategy = () => {
  return (error: Error): boolean => error.message === 'Network Error';
};
