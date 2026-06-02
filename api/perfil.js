export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return new Response(JSON.stringify({ error: 'ID no proporcionado' }), { status: 400 });

  try {
    const token = process.env.GITHUB_PAT;
    const usuario = process.env.GITHUB_USER;
    const repo = process.env.GITHUB_REPO;
    
    const url = `https://raw.githubusercontent.com/${usuario}/${repo}/main/base_datos.json`;
    
    const response = await fetch(url, {
      headers: { 
        'Authorization': `token ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

    if (!response.ok) return new Response(JSON.stringify({ error: 'Error en la bóveda' }), { status: 500 });

    const data = await response.json();
    const mascota = data[id];

    if (mascota) {
      return new Response(JSON.stringify(mascota), { status: 200, headers: { 'Content-Type': 'application/json' }});
    } else {
      return new Response(JSON.stringify({ error: 'Mascota no encontrada' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), { status: 500 });
  }
}
