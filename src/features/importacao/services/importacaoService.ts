import { http } from '@/shared/services/http'

export interface ImportacaoResultado {
  importacaoId: number
  total: number
  importados: number
  duplicados: number
  erros: number
}

export interface ImportacaoItem {
  id: number
  arquivo: string
  total: number
  importados: number
  duplicados: number
  erros: number
  importadoEm: string
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

  async listar(): Promise<ImportacaoItem[]> {
    const { data } = await http.get<ImportacaoItem[]>('/importacao')
    return data
  },

  async deletar(id: number): Promise<void> {
    await http.delete(`/importacao/${id}`)
  },
}
