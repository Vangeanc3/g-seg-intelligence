import { http } from '@/shared/services/http'
import type { CrimesGeoJson } from '../types/crime'

export interface CrimeFiltros {
  bairro?: string
  natureza?: string
  dataInicio?: string
  dataFim?: string
}

export type { CrimeProperties, CrimesGeoJson } from '../types/crime'

export const crimesService = {
  async getGeoJson(filtros: CrimeFiltros = {}): Promise<CrimesGeoJson> {
    const { data } = await http.get<CrimesGeoJson>('/crimes/geojson', {
      params: filtros,
    })

    return data
  },
}
