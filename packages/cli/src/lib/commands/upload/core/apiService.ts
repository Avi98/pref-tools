import fetch from 'isomorphic-fetch';
import { AUTH_HEADER } from '../../../utils/constants';

interface IApiService {
  baseUrl: string;
  url?: typeof URL;
  extraHeader?: Record<string, string>;
}

class APIService {
  private rootUrl: string;
  private extraHeaders: Record<string, string>;
  private url: typeof URL;
  private token: string;
  private fetch: typeof fetch;

  constructor(options: IApiService) {
    this.fetch = fetch;
    this.url = options.url || URL;
    this.rootUrl = options.baseUrl;
    this.token = '';
    this.extraHeaders = options.extraHeader || {};
  }

  private async fetchRequest(
    url: string,
    method: 'PUT' | 'POST',
    payload: Record<string, unknown>
  ) {
    try {
      const path = this.normalizeUrl(url).href;
      const body = JSON.stringify(payload);
      const result = await fetch(path, {
        body,
        method,
        headers: {
          [AUTH_HEADER]: this.token,
          ...this.extraHeaders,
        },
      }).then((re) => {
        return re;
      });
      return this.convertResults(result);
    } catch (error) {
      Promise.reject(error);
    }
  }

  async get(path: string, query?: Record<string, string>) {
    const requestURL = this.normalizeUrl(path);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        requestURL.searchParams.append(key, value);
      }
    }
    const result = await this.fetch(requestURL.href, {
      method: 'GET',
      headers: {
        [AUTH_HEADER]: this.token,
      },
    });

    return this.convertResults(result);
  }

  async setToken(token: string) {
    this.token = token;
  }

  private async convertResults(result: any) {
    //@TODO handle error
    return await result.json();
  }

  async post<IPayload extends Record<string, unknown>>(
    path: string,
    payload: IPayload
  ) {
    return this.fetchRequest(path, 'POST', payload);
  }

  async put(path: string, payload: Record<string, string>) {
    return this.fetchRequest(path, 'PUT', payload);
  }

  private normalizeUrl(url: string): URL {
    if (!url.startsWith('/'))
      throw new Error('\nUrl provided in base url does not starts with /\n');
    const requestUrl = this.rootUrl.endsWith('/')
      ? this.rootUrl.slice(0, this.rootUrl.length - 1) + url
      : this.rootUrl;

    return new this.url(requestUrl);
  }
}
export { APIService };
