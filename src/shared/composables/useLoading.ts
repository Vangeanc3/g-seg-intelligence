import { ref, onMounted } from 'vue'

export function useLoading(duracaoMs = 1200) {
  const carregando = ref(true)

  onMounted(() => {
    setTimeout(() => {
      carregando.value = false
    }, duracaoMs)
  })

  return { carregando }
}
