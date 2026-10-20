export function evaluateCaseModel(index: number, model: string, reference: string) {
  if (index === 1 && model === 'On-Premise') return { accepted: true, conditional: true, explanation: 'El caso original no exige migración a cloud. Mantener el sistema local es defendible si se justifica continuidad, compatibilidad y operación propia.' }
  if (index === 6 && model === 'PaaS') return { accepted: true, conditional: true, explanation: 'PaaS es defendible si soporta el servidor del juego y el escalado requerido; los picos no obligan a elegir IaaS.' }
  return { accepted: model === reference, conditional: false, explanation: model === reference ? 'Coincide con la propuesta de referencia para los requisitos indicados.' : 'Revisá cómo satisface los requisitos. La justificación escrita puede agregar supuestos; la app no los interpreta automáticamente.' }
}

export const changedCaseAlternatives: Record<number, string[]> = {
  0: ['Mixta', 'On-Premise'],
  1: ['Reevaluar', 'IaaS', 'PaaS', 'On-Premise'],
  2: ['IaaS', 'On-Premise'],
  3: ['Reevaluar', 'SaaS', 'PaaS', 'IaaS', 'On-Premise'],
}
