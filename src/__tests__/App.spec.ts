import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../App.vue'

describe('App', () => {
  it('renderiza o container principal com a rota atual', () => {
    const RouterViewStub = defineComponent({
      setup(_, { slots }) {
        return () =>
          slots.default?.({
            Component: defineComponent({
              template: '<div class="route-view">Rota atual</div>',
            }),
            route: { path: '/app/dashboard' },
          })
      },
    })

    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: RouterViewStub,
          ToastContainer: true,
          SplashScreen: true,
          Transition: false,
        },
      },
    })

    expect(wrapper.find('.route-view').text()).toBe('Rota atual')
  })
})
