---
outline: deep
---

<script setup>
import Badge from '../components/Badge.vue'
import BlockQuote from '../components/BlockQuote.vue'
</script>

# Module Overview

[[toc]]

The main module features the following exports:

```ts
// Stores and Model Classes
export { setupFeathersPinia } from './setup'
export { defineStore } from './define-store'
export { defineAuthStore } from './define-auth-store'
export { makeServiceStore, BaseModel } from './service-store/index'

// Global Reference Objects
export { clients } from './clients'
export { models, registerClient } from './models'

// Common Tools
export { useClones } from './use-clones'
export { usePagination } from './use-pagination'

// 
export { useFindWatched } from './use-find-watched'
export { useGetWatched } from './use-get-watched'

// Storage Utilities
export { syncWithStorage } from './storage-sync'
export { syncWithStorageCompressed } from './storage-sync-compressed'
export { clearStorage } from './clear-storage'
```

## Stores and Model Classes

- **`setupFeathersPinia`** allows global configuration of `clients` for all apps. It can also be used to support a common set of options for the returned, wrapped `defineStore` function. Right now it's not that useful for SSR apps, which require an alternative configuration.
- **`defineStore`** sets up a single Pinia store for a single Feathers service.
- **`defineAuthStore`** sets up a single Pinia store for an authentication service. See [Auth Stores](./auth-stores)
- **`BaseModel`** is the base class for working with [Data Modeling](./model-classes).
- `makeServiceStore` is an internal utility that assists in structuring service stores. Don't use it.

## Global Reference Objects

- **`clients`** stores a reference to every Feathers client provided to either `setupFeathersPinia` or `defineStore`.

  - After setup, you can reference a `FeathersClient` at any time as shown below. This might come in handy if you need to fetch data that you don't want to be reactive. That data also won't end up in the store, so it would require refetching if not manually stored somewhere. You could use this with [swrv](https://docs-swrv.netlify.app/).

  ```ts
  import { clients } from 'feathers-pinia'
  const { api } = clients

  const result = await api.service('items').find({ query: {} })
  ```

  - If you call your default client `api`, you won't have to provide a custom `clientAlias` option to the `defineStore` function. Learn about setting up FeathersClient instances in [Setup](./setup).
- **`registerClient`** adds a client by name to the `clients` object.  `registerClient('api', feathersClientInstance)`.

- **`models`** stores a reference to every custom model provided to `defineStore`.

## Common Tools

- **`useFind`** <Badge>New API in v1</Badge> is a utility that assists you in implementing the Live Query pattern. Give it a set of params and you'll get back live-updating lists of `data`, as well as pagination utilities like `next`, and `prev`. It's super versatile, handling declarative and imperative workflows that support both the client- and server-side pagination. It's similar to SWR but far more intelligent, being able to reuse data between different queries. See [useFind](./use-find)
- **`useGet`** <Badge>New API in v1</Badge>
- **`usePagination`** is a composition api utility that handles typical pagination logic. See [usePagination](./use-pagination)
- **`useClones`** removes boilerplate from the [clone and commit pattern](https://vuex.feathersjs.com/feathers-vuex-forms.html#the-clone-and-commit-pattern). It automatically clones all component props containing a `feathers-pinia` instance and provides a handy `save` function for each one. The `save` function performs automatic diffing to only patch data that has changed. See [useClones](./use-clones)

## Feathers-Vuex Migration Utils

These utilities exist to assist with migration from Feathers-Vuex. Use them for migrating existing Feathers-Vuex code, but not for new development. Use the new `useFind` and `useGet` utilities for new development.

- **`useFindWatched`** is the equivalent to Feathers-Vuex's `useFind` utility. See [useFindWatched](./use-find-watched)
- **`useGetWatched`** is the equivalent to Feathers-Vuex's `useGet` utility. See [useGetWatched](./use-get-watched).

## Storage Sync

- **`syncWithStorage`** synchronizes specific parts of a store's state into `localStorage` or any [Storage-compatible](https://developer.mozilla.org/en-US/docs/Web/API/Storage) adapter you provide.
- **`clearStorage`** clears data stored with the above utilities.

Learn more about these utilities in [syncWithStorage](./storage-sync)
