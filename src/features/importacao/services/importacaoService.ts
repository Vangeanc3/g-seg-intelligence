import { http } from '@/shared/services/http'

export interface ImportacaoResultado {
  importacaoId: number
  total: number
  importados: number
  duplicados: number
  erros: number
}

export const importacaoService = {
  async upload(file: File, onProgress?: (pct: number) => void): Promise<ImportacaoResultado> {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await http.post<ImportacaoResultado>('/importacao/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      },
    })
    return data
  },
}
