/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseModel, useService, defineServiceStore } from '../src/index' // from 'feathers-pinia'
import { createPinia } from 'pinia'
import { api } from './feathers'

const pinia = createPinia()

export class User extends BaseModel {
  _id: number
  name: string

  messages?: Partial<Message>[]

  constructor(data: Partial<User>) {
    super()
    this.init(data)
  }
}

/**
 * Below is an example of a Model class in a TypeScript-based app.
 */

// Define the interface and defaults directly on the Model instead of `instanceDefaults`.
export class Message extends BaseModel {
  _id: number
  text = 'foo'
  text2: string
  userId: null | number
  createdAt: Date | null

  // Values added in the constructor can be added to the interface for type friendliness.
  user?: Partial<User>
  user2?: Partial<User> = { name: 'Larry' }

  // The constructor takes the place of `setupInstance`.
  constructor(data: Partial<Message> = {}) {
    super()
    this.init(data)

    this.user2 = { name: 'Marshall' }
  }

  // You can still use, `setupInstance` if you prefer.
  static setupInstance(message: Message) {
    // access to `store` and is from `this`.
    const { store } = this
  }
}

const useMessagesService = defineServiceStore('messages', () =>
  useService({ servicePath: 'messages', Model: Message, app: api }),
)
const messagesService = useMessagesService(pinia)

describe('Model Classes Using TypeScript', () => {
  const resetStore = () => {
    api.service('messages').store = {}
  }
  beforeAll(() => resetStore())
  afterAll(() => resetStore())

  test('passed-in values overwrite all defaults', async () => {
    const message = new Message({ text: 'Here I am!' }).addToStore() as Message
    expect(message.text).toBe('Here I am!')
  })

  test('Model interface defaults are used when no value is provided', async () => {
    const message = new Message({}).addToStore() as Message
    expect(message.text).toBe('foo')
  })

  test("message.user has no default value because it is in the Model's TypeScript interface", async () => {
    const message = new Message({}).addToStore() as Message
    expect(message.user).toBe(undefined)
  })

  test('setupInstance values overwrite class defaults', async () => {
    const message = new Message({}).addToStore() as Message
    expect(message.user2?.name).toBe('Marshall')
  })

  test('setupInstance runs after save', async () => {
    const message = new Message({}).addToStore() as Message
    await message.save()
    expect(message.user2?.name).toBe('Marshall')
  })
})
