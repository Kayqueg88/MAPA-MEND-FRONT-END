export async function geocodeEndereco(endereco) {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?format=json` +
    `&q=${encodeURIComponent(endereco)}` +
    `&countrycodes=br` +
    `&limit=1`;

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json"
    }
  });

  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error("EnderecoNaoEncontrado");
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name
  };
}
