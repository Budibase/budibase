import * as axios from 'axios'

interface IAxiosRetry {
  (
    axios: axios.AxiosStatic | axios.AxiosInstance,
    axiosRetryConfig?: IAxiosRetry.IAxiosRetryConfig
  ): void;

  isNetworkError(error: Error): boolean;
  isRetryableError(error: Error): boolean;
  isSafeRequestError(error: Error): boolean;
  isIdempotentRequestError(error: Error): boolean;
  isNetworkOrIdempotentRequestError(error: Error): boolean;
  exponentialDelay(retryNumber: number): number;
}

export function isNetworkError(error: Error): boolean;
export function isRetryableError(error: Error): boolean;
export function isSafeRequestError(error: Error): boolean;
export function isIdempotentRequestError(error: Error): boolean;
export function isNetworkOrIdempotentRequestError(error: Error): boolean;
export function exponentialDelay(retryNumber: number): number;

declare namespace IAxiosRetry {
  export interface IAxiosRetryConfig {
    /**
     * The number of times to retry before failing
     * default: 3
     *
     * @type {number}
     */
    retries?: number,
    /**
     * Defines if the timeout should be reset between retries
     * default: false
     *
     * @type {boolean}
     */
    shouldResetTimeout?: boolean,
    /**
     * A callback to further control if a request should be retried. By default, it retries if the result did not have a response.
     * default: error => !error.response
     *
     * @type {Function}
     */
    retryCondition?: (error: axios.AxiosError) => boolean | Promise<boolean>,
    /**
     * A callback to further control the delay between retry requests. By default there is no delay.
     *
     * @type {Function}
     */
    retryDelay?: (retryCount: number, error: axios.AxiosError) => number
  }
}

declare const axiosRetry: IAxiosRetry;

export type IAxiosRetryConfig = IAxiosRetry.IAxiosRetryConfig;

export default axiosRetry;

declare module 'axios' {
  export interface AxiosRequestConfig {
    'axios-retry'?: IAxiosRetryConfig;
  }
}
