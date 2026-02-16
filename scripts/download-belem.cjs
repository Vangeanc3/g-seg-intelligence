const https = require('https');
const fs = require('fs');
const path = require('path');

// APENAS Belém — não incluir outros municípios da RMB
const BELEM_CODIGO = '1501402';
const url = `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${BELEM_CODIGO}?formato=application/vnd.geo+json`;

console.log('🗺️  Baixando malha municipal de Belém...\n');
console.log(`Código IBGE: ${BELEM_CODIGO}`);
console.log(`URL: ${url}\n`);

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      // Criar diretório se não existir
      const dataDir = path.join(__dirname, '../public/data');
      fs.mkdirSync(dataDir, { recursive: true });

      // Salvar arquivo
      const outputPath = path.join(dataDir, 'belem_boundary.geojson');
      fs.writeFileSync(outputPath, data);

      console.log('✅ Malha de Belém baixada com sucesso!');
      console.log(`📁 Arquivo salvo em: ${outputPath}`);

      // Analisar o GeoJSON
      const geojson = JSON.parse(data);
      console.log('\n📊 Análise do arquivo:');
      console.log(`   Features: ${geojson.features?.length || 0}`);
      console.log(`   Tipo geometria: ${geojson.features?.[0]?.geometry?.type || 'desconhecido'}`);

      // Se for MultiPolygon, mostrar quantos polígonos (ilhas)
      if (geojson.features?.[0]?.geometry?.type === 'MultiPolygon') {
        const polyCount = geojson.features[0].geometry.coordinates.length;
        console.log(`   Polígonos (ilhas/partes): ${polyCount}`);
      }

      // Calcular bounding box
      if (geojson.features?.[0]?.geometry?.coordinates) {
        let minLng = Infinity, maxLng = -Infinity;
        let minLat = Infinity, maxLat = -Infinity;

        const coords = geojson.features[0].geometry.coordinates;
        const flatCoords = [];

        // Função para achatar coordenadas recursivamente
        function flatten(arr) {
          arr.forEach(item => {
            if (Array.isArray(item[0])) {
              flatten(item);
            } else {
              flatCoords.push(item);
            }
          });
        }

        flatten(coords);

        flatCoords.forEach(([lng, lat]) => {
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        });

        console.log('\n📍 Bounding box de Belém:');
        console.log(`   Longitude: ${minLng.toFixed(4)} a ${maxLng.toFixed(4)}`);
        console.log(`   Latitude: ${minLat.toFixed(4)} a ${maxLat.toFixed(4)}`);
        console.log('\n💡 Sugestão de maxBounds para o mapa:');
        console.log(`   maxBounds: [[${minLng.toFixed(2)}, ${minLat.toFixed(2)}], [${maxLng.toFixed(2)}, ${maxLat.toFixed(2)}]]`);
      }

    } catch (error) {
      console.error('❌ Erro ao processar arquivo:', error.message);
    }
  });

}).on('error', (err) => {
  console.error('❌ Erro ao baixar:', err.message);
});
