import axios from 'axios';
import { cleanupAfterApiCall } from './cleanup';

let installed = false;

export function installAxiosInterceptors(): void {
  if (installed) return;
  installed = true;

  axios.interceptors.response.use(
    (response) => {
      cleanupAfterApiCall();
      return response;
    },
    (error) => {
      cleanupAfterApiCall();
      return Promise.reject(error);
    }
  );
}