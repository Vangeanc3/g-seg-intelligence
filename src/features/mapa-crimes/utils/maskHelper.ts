/**
 * Cria uma máscara que escurece tudo FORA da área fornecida.
 *
 * Técnica: Polígono do mundo todo com "buracos" na forma de Belém.
 * Quando preenchido com cor escura, só Belém fica visível (incluindo ilhas).
 */
export function createMask(boundaryGeojson: GeoJSON.FeatureCollection): GeoJSON.Feature {
  // Polígono que cobre o mundo inteiro
  const worldBounds: GeoJSON.Position[] = [
    [-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]
  ]

  if (!boundaryGeojson.features || boundaryGeojson.features.length === 0) {
    throw new Error('GeoJSON de boundary inválido — sem features')
  }

  // Coletar todos os buracos (holes) de todas as features
  const allHoles: GeoJSON.Position[][] = []

  boundaryGeojson.features.forEach(feature => {
    const geometry = feature.geometry

    if (!geometry) return

    // Se for Polygon simples
    if (geometry.type === 'Polygon') {
      allHoles.push(...geometry.coordinates)
    }

    // Se for MultiPolygon (município pode ter ilhas)
    if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((poly: GeoJSON.Position[][]) => {
        allHoles.push(...poly)
      })
    }
  })

  if (allHoles.length === 0) {
    throw new Error('Nenhum polígono válido encontrado no GeoJSON')
  }

  // Retornar polígono do mundo com buracos nos municípios
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [worldBounds, ...allHoles]
    }
  }
}
