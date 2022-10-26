import feathers, { HookContext } from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import { Service } from 'feathers-memory'
import axios from 'axios'
import auth from '@feathersjs/authentication-client'
import { timeout } from './test-utils'

const restClient = rest()

export const api: any = feathers().configure(restClient.axios(axios)).configure(auth())

api.authentication.service.hooks({
  before: {
    create: [
      (context: HookContext) => {
        const { data } = context
        if (data.strategy === 'jwt') {
          context.result = { accessToken: 'jwt-access-token', payload: { test: true } }
        }
      },
    ],
  },
})

api.use('users', new Service({ paginate: { default: 10, max: 100 }, whitelist: ['$options'] }))
api.use('messages', new Service({ paginate: { default: 10, max: 100 }, whitelist: ['$options'] }))
api.use('alt-ids', new Service({ paginate: { default: 10, max: 100 }, whitelist: ['$options'], id: '_id' }))
api.use('custom-ids', new Service({ paginate: { default: 10, max: 100 }, whitelist: ['$options'], id: 'my-id' }))
api.use('todos', new Service({ paginate: { default: 10, max: 100 }, whitelist: ['$options'] }))

const hooks = {
  before: {
    find: [
      async () => {
        await timeout(0)
      },
    ],
  },
}
api.service('users').hooks(hooks)
api.service('messages').hooks(hooks)
