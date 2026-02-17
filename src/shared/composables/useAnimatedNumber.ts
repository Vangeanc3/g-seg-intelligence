import { ref, watch, type Ref } from 'vue'

export function useAnimatedNumber(valor: Ref<number>, duracao = 800) {
  const display = ref(0)
  let frame: number | null = null

  function animar(de: number, para: number) {
    if (frame) cancelAnimationFrame(frame)

    const inicio = performance.now()
    const diff = para - de

    function step(agora: number) {
      const progresso = Math.min((agora - inicio) / duracao, 1)
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progresso, 3)
      display.value = Math.round(de + diff * eased)

      if (progresso < 1) {
        frame = requestAnimationFrame(step)
      }
    }

    frame = requestAnimationFrame(step)
  }

  watch(valor, (novo, antigo) => {
    animar(antigo ?? 0, novo)
  }, { immediate: true })

  return display
}
