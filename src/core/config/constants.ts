export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  VERSION: 'v1',
} as const

export const MAPA_CONFIG = {
  CENTRO_PADRAO: {
    lat: -1.4558,
    lng: -48.4902,
  },
  ZOOM_PADRAO: 13,
  ZOOM_MIN: 10,
  ZOOM_MAX: 18,
  RAIO_BUSCA_METROS: 5000,
  MAPBOX_STYLE: 'mapbox://styles/mapbox/dark-v11',
} as const

export const CRIMES_CONFIG = {
  CORES: {
    roubo: '#ef4444', // vermelho
    furto: '#f59e0b', // laranja
    homicidio: '#dc2626', // vermelho escuro
    trafico: '#8b5cf6', // roxo
    agressao: '#ec4899', // rosa
    outro: '#6b7280', // cinza
  },
  ICONES: {
    roubo: 'mdi-pistol',
    furto: 'mdi-hand-back-left',
    homicidio: 'mdi-alert',
    trafico: 'mdi-pill',
    agressao: 'mdi-account-alert',
    outro: 'mdi-help-circle',
  },
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  TOKEN_EXPIRY_HOURS: 24,
} as const

export const LOCALIZACAO = {
  CIDADE: 'Belém',
  ESTADO: 'Pará',
  UF: 'PA',
} as const

export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_TIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
} as const
