import { createPinia } from 'pinia'
import { BaseModel, useService, defineServiceStore, AnyData } from '../src'
import { api } from './feathers'

const pinia = createPinia()

class Message extends BaseModel {
  // This doesn't work as a default value.
  // It will overwrite all passed-in values and always be this value.
  text = 'This gets overwritten by the instanceDefaults'
  otherText: string

  constructor(data: Partial<Message>) {
    super()
    this.init(data)
  }

  static instanceDefaults(): Partial<Message> {
    return {
      text: 'this overwrites the model default',
      otherText: `this won't get overwritten and works great for a default value`,
    }
  }
}

const servicePath = 'messages'
const useMessagesService = defineServiceStore(servicePath, () => useService({ servicePath, Model: Message, app: api }))

const messagesService = useMessagesService(pinia)

const resetStore = () => {
  api.service('messages').store = {}
}

describe('Model Instance Defaults', () => {
  beforeAll(() => resetStore())
  afterAll(() => resetStore())

  test('provided data overwrites defaults', async () => {
    const message = await messagesService.create({
      text: 'This overwrites anything',
    })
    expect(message.text).toBe('This overwrites anything')
    expect(message.otherText).toBe("this won't get overwritten and works great for a default value")
  })

  test('use instanceDefaults for default values', async () => {
    const message = await messagesService.create({})
    expect(message.text).toBe(`this overwrites the model default`)
    expect(message.otherText).toBe("this won't get overwritten and works great for a default value")
  })
})
