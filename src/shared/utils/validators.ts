// src/shared/utils/validators.ts

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida CPF
 */
export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '')

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false
  }

  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let resto = 11 - (soma % 11)
  const digito1 = resto === 10 || resto === 11 ? 0 : resto

  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i)
  }
  resto = 11 - (soma % 11)
  const digito2 = resto === 10 || resto === 11 ? 0 : resto

  return parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2
}

/**
 * Valida telefone brasileiro
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

/**
 * Valida senha forte
 */
export function isStrongPassword(password: string): boolean {
  // Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return regex.test(password)
}
