export type NotificacaoTipo = 'crime' | 'sistema' | 'relatorio' | 'alerta'

export interface Notificacao {
  id: number
  tipo: NotificacaoTipo
  titulo: string
  mensagem: string
  lida: boolean
  criadoEm: string // ISO date
}

export function getNotificacoes(): Notificacao[] {
  const agora = Date.now()
  return [
    {
      id: 1,
      tipo: 'alerta',
      titulo: 'Aumento de crimes no Umarizal',
      mensagem: 'Detectamos aumento de 23% em ocorrências de roubo no bairro Umarizal nos últimos 7 dias.',
      lida: false,
      criadoEm: new Date(agora - 1000 * 60 * 30).toISOString(), // 30min atrás
    },
    {
      id: 2,
      tipo: 'crime',
      titulo: 'Nova ocorrência registrada',
      mensagem: 'Furto registrado na Av. Presidente Vargas, Campina — hoje às 14:32.',
      lida: false,
      criadoEm: new Date(agora - 1000 * 60 * 60 * 2).toISOString(), // 2h atrás
    },
    {
      id: 3,
      tipo: 'relatorio',
      titulo: 'Relatório semanal disponível',
      mensagem: 'O relatório de crimes da semana 06/02 a 12/02 está pronto para download.',
      lida: false,
      criadoEm: new Date(agora - 1000 * 60 * 60 * 5).toISOString(), // 5h atrás
    },
    {
      id: 4,
      tipo: 'sistema',
      titulo: 'Atualização da plataforma',
      mensagem: 'Novos filtros de data e busca por endereço foram adicionados ao mapa.',
      lida: true,
      criadoEm: new Date(agora - 1000 * 60 * 60 * 24).toISOString(), // 1 dia
    },
    {
      id: 5,
      tipo: 'alerta',
      titulo: 'Zona de risco: Jurunas',
      mensagem: 'O bairro Jurunas mantém índice elevado de ocorrências pelo 3º mês consecutivo.',
      lida: true,
      criadoEm: new Date(agora - 1000 * 60 * 60 * 48).toISOString(), // 2 dias
    },
    {
      id: 6,
      tipo: 'crime',
      titulo: 'Ocorrência próxima ao seu interesse',
      mensagem: 'Roubo de veículo registrado na Tv. Padre Eutíquio, Batista Campos.',
      lida: true,
      criadoEm: new Date(agora - 1000 * 60 * 60 * 72).toISOString(), // 3 dias
    },
  ]
}
