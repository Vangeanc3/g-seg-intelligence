import type { Crime } from '../types/crime'

const bairros = [
  { nome: 'Umarizal', lat: -1.4430, lng: -48.4874 },
  { nome: 'Nazaré', lat: -1.4500, lng: -48.4880 },
  { nome: 'Marco', lat: -1.4350, lng: -48.4750 },
  { nome: 'Pedreira', lat: -1.4550, lng: -48.4700 },
  { nome: 'Sacramenta', lat: -1.4420, lng: -48.4600 },
  { nome: 'Jurunas', lat: -1.4650, lng: -48.5050 },
  { nome: 'Guamá', lat: -1.4700, lng: -48.4850 },
  { nome: 'Terra Firme', lat: -1.4750, lng: -48.4780 },
  { nome: 'Marambaia', lat: -1.3900, lng: -48.4650 },
  { nome: 'Coqueiro', lat: -1.3700, lng: -48.4400 },
  { nome: 'Tapanã', lat: -1.3650, lng: -48.4350 },
  { nome: 'Cidade Velha', lat: -1.4560, lng: -48.5070 },
  { nome: 'Campina', lat: -1.4530, lng: -48.5020 },
  { nome: 'Batista Campos', lat: -1.4470, lng: -48.4920 },
  { nome: 'São Brás', lat: -1.4400, lng: -48.4830 },
]

const tipos: Array<Crime['tipo']> = ['roubo', 'furto', 'homicidio', 'trafico', 'agressao', 'outro']
const statuses: Array<Crime['status']> = ['aberto', 'em_investigacao', 'solucionado']

function randomOffset(): number {
  return (Math.random() - 0.5) * 0.01
}

function gerarCrimesMock(quantidade: number): Crime[] {
  const crimes: Crime[] = []
  for (let i = 0; i < quantidade; i++) {
    const bairro = bairros[Math.floor(Math.random() * bairros.length)]!
    const tipo = tipos[Math.floor(Math.random() * tipos.length)]!
    const status = statuses[Math.floor(Math.random() * statuses.length)]!
    const diasAtras = Math.floor(Math.random() * 90)
    const data = new Date()
    data.setDate(data.getDate() - diasAtras)

    crimes.push({
      id: `crime-${i + 1}`,
      tipo,
      descricao: `Ocorrência de ${tipo} registrada em ${bairro.nome}`,
      data: data.toISOString(),
      lat: bairro.lat + randomOffset(),
      lng: bairro.lng + randomOffset(),
      endereco: `Rua ${Math.floor(Math.random() * 100)}, ${bairro.nome}`,
      bairro: bairro.nome,
      status,
    })
  }
  return crimes
}

export const crimesMock = gerarCrimesMock(500)

export function getCrimes(): Promise<Crime[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(crimesMock), 300)
  })
}

export function getCrimesGeoJSON(crimes: Crime[]) {
  return {
    type: 'FeatureCollection' as const,
    features: crimes.map((crime) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [crime.lng, crime.lat],
      },
      properties: {
        id: crime.id,
        tipo: crime.tipo,
        descricao: crime.descricao,
        data: crime.data,
        endereco: crime.endereco,
        bairro: crime.bairro,
        status: crime.status,
      },
    })),
  }
}