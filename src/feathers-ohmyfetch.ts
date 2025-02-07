import { FetchClient } from '@feathersjs/rest-client'
import type { Params } from '@feathersjs/feathers'

export class OhMyFetch extends FetchClient {
  async request(options: any, params: Params) {
    const fetchOptions = Object.assign({}, options, (params as any).connection)

    fetchOptions.headers = Object.assign({ Accept: 'application/json' }, this.options.headers, fetchOptions.headers)

    if (options.body) fetchOptions.body = options.body

    try {
      const response = await this.connection.raw(options.url, fetchOptions)
      const { _data, status } = response

      if (status === 204) return null
      return _data
    } catch (error) {
      console.error('feathers-ohmyfetch request error', error)
      throw error
    }
  }
}
