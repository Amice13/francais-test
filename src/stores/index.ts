// Utilities
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { PiniaSharedState } from 'pinia-shared-state'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Shared state across different tabs
pinia.use(
  PiniaSharedState({
    // Enables the plugin for all stores. Defaults to true.
    enable: true,
    // If set to true this tab tries to immediately recover the shared state from another tab. Defaults to true.
    initialize: true,
    // Enforce a type. One of native, idb, localstorage or node. Defaults to native.
    type: 'localstorage'
  })
)

export default pinia
