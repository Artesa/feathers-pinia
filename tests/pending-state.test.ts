import { watch, computed } from 'vue-demi'
import { createPinia } from 'pinia'
import { api } from './feathers'
import { resetStores } from './test-utils'
import { BaseModel, RequestTypeById, useService, defineServiceStore } from '../src'
import { expect, vi } from 'vitest'

const pinia = createPinia()

class Message extends BaseModel {
  static modelName = 'Message'

  constructor(data: Partial<Message>) {
    super()
    this.init(data)
  }
}

const servicePath = 'messages'
const useMessagesService = defineServiceStore(servicePath, () => useService({ servicePath, Model: Message, app: api }))

const messagesService = useMessagesService(pinia)

const reset = () => resetStores(api.service('messages'), messagesService)

describe('Pending State', () => {
  describe('Model.find and Model.get', () => {
    beforeEach(async () => {
      reset()
      await messagesService.create({ text: 'test message' })
    })
    afterAll(() => reset())

    test('pending state for find success', async () => {
      // setup the watcher with a mock function
      const handler = vi.fn()
      watch(() => messagesService.isFindPending, handler)

      // Trigger the watcher with a request.
      await messagesService.find({ query: {} })

      // The first time it's called, the first argument should be true.
      expect(handler.mock.calls[0][0]).toBe(true)
      // The second time it's called, the first argument should be false.
      expect(handler.mock.calls[1][0]).toBe(false)
    })

    test('pending state for find error', async () => {
      const handler = vi.fn()
      watch(() => messagesService.isFindPending, handler)

      try {
        // Feathers will throw because of $custom
        await messagesService.find({ query: { $custom: null } })
      } catch (error) {
        expect(handler.mock.calls[0][0]).toBe(true)
        expect(handler.mock.calls[1][0]).toBe(false)
      }
    })

    test('pending state for count success', async () => {
      // setup the watcher with a mock function
      const handler = vi.fn()
      watch(() => messagesService.isCountPending, handler)

      // Trigger the watcher with a request.
      await messagesService.count({ query: {} })

      // The first time it's called, the first argument should be true.
      expect(handler.mock.calls[0][0]).toBe(true)
      // The second time it's called, the first argument should be false.
      expect(handler.mock.calls[1][0]).toBe(false)
    })

    test('pending state for count error', async () => {
      const handler = vi.fn()
      watch(() => messagesService.isCountPending, handler)

      try {
        // Feathers will throw because of $custom
        await messagesService.count({ query: { $custom: null } })
      } catch (error) {
        expect(handler.mock.calls[0][0]).toBe(true)
        expect(handler.mock.calls[1][0]).toBe(false)
      }
    })

    test('pending state for get success', async () => {
      const handler = vi.fn()
      watch(() => messagesService.isGetPending, handler)

      await messagesService.get(0)

      expect(handler.mock.calls[0][0]).toBe(true)
      expect(handler.mock.calls[1][0]).toBe(false)
    })

    test('pending state for get error', async () => {
      const handler = vi.fn()
      watch(() => messagesService.isGetPending, handler)

      try {
        // Feathers will throw because there's no record with id: 1
        await messagesService.get(1)
      } catch (error) {
        expect(handler.mock.calls[0][0]).toBe(true)
        expect(handler.mock.calls[1][0]).toBe(false)
      }
    })
  })

  describe('instance pending state', () => {
    const message = computed(() => messagesService.itemsById[0])

    beforeEach(async () => {
      // reset()
      await messagesService.create({ text: 'test message' })
    })
    afterEach(() => reset())

    test('pending state for model.create', async () => {
      const createState = computed(() => messagesService.createPendingById[1])
      const handler = vi.fn()
      watch(() => createState.value, handler, { immediate: true })

      const msg = await new Message({ text: 'some new message' }).create()

      expect(msg.isCreatePending).toBe(false)
      expect(msg.isSavePending).toBe(false)

      // Since there's no id, the handler only gets called once with undefined
      expect(handler.mock.calls[0][0]).toBeUndefined()
      expect(handler).toBeCalledTimes(1)
    })

    test('pending state for model.patch', async () => {
      const message = computed(() => messagesService.itemsById[0])

      const patchState = computed(() => messagesService.patchPendingById[0])
      const handler = vi.fn()
      watch(() => patchState.value, handler, { immediate: true })

      const data = { test: true }
      await message.value.patch({ data })

      expect(message.value.isSavePending).toBe(false)
      expect(message.value.isPatchPending).toBe(false)

      expect(handler.mock.calls[0][0]).toBeUndefined()
      expect(handler.mock.calls[1][0]).toBe(true)
      expect(handler.mock.calls[2][0]).toBeUndefined()
    })

    test('pending state for model.update', async () => {
      const updateState = computed(() => messagesService.updatePendingById[0])
      const handler = vi.fn()
      watch(() => updateState.value, handler, { immediate: true })

      await message.value.update()

      expect(message.value.isUpdatePending).toBe(false)

      expect(handler.mock.calls[0][0]).toBeUndefined()
      expect(handler.mock.calls[1][0]).toBe(true)
      expect(handler.mock.calls[2][0]).toBeUndefined()
    })

    test('pending state for model.remove', async () => {
      const removeState = computed(() => messagesService.removePendingById[0])
      const handler = vi.fn()
      watch(() => removeState.value, handler, { immediate: true })

      await message.value.remove()

      expect(message.value).toBe(undefined)

      // Not initially in store
      expect(handler.mock.calls[0][0]).toBeUndefined()
      // Set to true while pending
      expect(handler.mock.calls[1][0]).toBe(true)
      // Record gets removed from store
      expect(handler.mock.calls[2][0]).toBeUndefined()
    })
  })

  describe('Model getters for instance state', () => {
    test.each([
      ['isCreatePending', 'create'],
      ['isPatchPending', 'patch'],
      ['isUpdatePending', 'update'],
      ['isRemovePending', 'remove'],
    ])('add(%i, %i) -> %i', (title, method) => {
      messagesService.setPendingById('foo', method as RequestTypeById, true)
      expect(messagesService[title]).toBe(true)
      messagesService.setPendingById('foo', method as RequestTypeById, false)
      expect(messagesService[title]).toBeFalsy()
    })
  })
})
