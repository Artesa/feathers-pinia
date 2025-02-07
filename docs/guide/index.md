---
outline: deep
---
# Introduction

[[toc]]

Feathers-Pinia is the next generation of [Feathers-Vuex](https://vuex.feathersjs.com). The difference is that it's built on [Pinia](https://pinia.esm.dev/): a Vue store with an intuitive API.

::: tip Introducing Pinia
PERSONAL OPINION ALERT: [Pinia](https://pinia.esm.dev/) is so simple and elegant. It matches Vue better than Vuex does. The research for Pinia is fueling inspiration for Vuex 5, which means the API is similar to the proposed [Vuex 5 API](https://github.com/kiaking/rfcs/blob/vuex-5/active-rfcs/0000-vuex-5.md).
:::

Using Pinia in your apps will have a few positive effects:

- The clean API requires lower mental overhead to use.
  - No more weird Vuex syntax.
  - No more mutations; just actions.
  - Use Composable Stores instead of injected rootState, rootGetters, etc.
- Lower mental overhead means developers spend more time in a creative space. This usually results in an increase of productivity.
- You'll have smaller bundle sizes. Not only is Pinia tiny, it's also modular. You don't have to register all of the plugins in a central store. Pinia's architecture enables tree shaking, so only the services needed for the current view need to load.
- You'll be more ready for the major breaking changes coming in Vuex 5. Vuex was originally written as a Flux/Redux implementation for Vue. It has served its purpose well. With Vuex 5, the team is focusing on making a store that matches Vue's elegance.
