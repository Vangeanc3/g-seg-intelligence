const https = require('https');
const fs = require('fs');
const path = require('path');

// Municípios da Região Metropolitana de Belém (RMB)
// Crimes em toda a RMB afetam análise de segurança de Belém
const municipiosRMB = [
  { nome: 'Belém', codigo: '1501402' },
  { nome: 'Ananindeua', codigo: '1500800' },
  { nome: 'Marituba', codigo: '1504422' },
  { nome: 'Benevides', codigo: '1501451' },
  { nome: 'Santa Bárbara do Pará', codigo: '1506187' },
  { nome: 'Santa Isabel do Pará', codigo: '1506500' },
  { nome: 'Castanhal', codigo: '1502400' },
  { nome: 'Barcarena', codigo: '1501303' }
];

console.log('🗺️  Baixando contornos da Região Metropolitana de Belém...\n');
console.log(`Total de municípios: ${municipiosRMB.length}\n`);

// Função para baixar um município
function downloadMunicipio(municipio) {
  return new Promise((resolve, reject) => {
    const url = `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${municipio.codigo}?formato=application/vnd.geo+json`;

    console.log(`📥 Baixando ${municipio.nome} (${municipio.codigo})...`);

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const geojson = JSON.parse(data);

          if (!geojson.features || geojson.features.length === 0) {
            reject(new Error(`Nenhuma feature encontrada para ${municipio.nome}`));
            return;
          }

          console.log(`   ✓ ${municipio.nome} baixado (${geojson.features.length} feature)`);
          resolve(geojson.features[0]);
        } catch (e) {
          reject(new Error(`Erro ao parsear JSON de ${municipio.nome}: ${e.message}`));
        }
      });
    }).on('error', (e) => {
      reject(new Error(`Erro ao baixar ${municipio.nome}: ${e.message}`));
    });
  });
}

// Baixar todos os municípios
async function baixarTodos() {
  const features = [];
  const erros = [];

  for (const municipio of municipiosRMB) {
    try {
      const feature = await downloadMunicipio(municipio);
      features.push(feature);
      // Pequeno delay para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`   ✗ Erro: ${error.message}`);
      erros.push({ municipio: municipio.nome, erro: error.message });
    }
  }

  if (features.length === 0) {
    console.error('\n❌ Nenhum município foi baixado com sucesso!');
    process.exit(1);
  }

  // Criar FeatureCollection com todos os municípios
  const rmb = {
    type: 'FeatureCollection',
    name: 'Região Metropolitana de Belém',
    features: features
  };

  // Criar diretório se não existir
  const dataDir = path.join(__dirname, '../public/data');
  fs.mkdirSync(dataDir, { recursive: true });

  // Salvar arquivo
  const outputPath = path.join(dataDir, 'rmb_boundary.geojson');
  fs.writeFileSync(outputPath, JSON.stringify(rmb, null, 2));

  console.log(`\n✅ Região Metropolitana de Belém salva em: ${outputPath}`);
  console.log(`📊 Municípios incluídos: ${features.length}/${municipiosRMB.length}`);

  // Listar municípios incluídos
  console.log('\n🏙️  Municípios na RMB:');
  municipiosRMB.forEach((mun, idx) => {
    const incluido = features.some(f => f.properties?.codarea === mun.codigo);
    console.log(`   ${incluido ? '✓' : '✗'} ${idx + 1}. ${mun.nome}`);
  });

  // Mostrar erros se houver
  if (erros.length > 0) {
    console.log('\n⚠️  Erros durante o download:');
    erros.forEach(e => {
      console.log(`   - ${e.municipio}: ${e.erro}`);
    });
  }

  // Calcular bounding box da RMB
  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  features.forEach(feature => {
    const coords = feature.geometry.coordinates;

    function flatten(arr) {
      const result = [];
      function recurse(item) {
        if (Array.isArray(item[0])) {
          item.forEach(recurse);
        } else {
          result.push(item);
        }
      }
      recurse(arr);
      return result;
    }

    const flatCoords = flatten(coords);
    flatCoords.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
  });

  console.log('\n📍 Bounding box da RMB:');
  console.log(`   Longitude: ${minLng.toFixed(4)} a ${maxLng.toFixed(4)}`);
  console.log(`   Latitude: ${minLat.toFixed(4)} a ${maxLat.toFixed(4)}`);
  console.log('\n💡 Sugestão de maxBounds para o mapa:');
  console.log(`   maxBounds: [[${minLng.toFixed(2)}, ${minLat.toFixed(2)}], [${maxLng.toFixed(2)}, ${maxLat.toFixed(2)}]]`);
}

baixarTodos().catch(console.error);
