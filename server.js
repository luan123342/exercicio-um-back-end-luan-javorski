
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const caminho = path.join(__dirname, 'dados', 'jogos.json');

function lerDados() {
  return JSON.parse(fs.readFileSync(caminho, 'utf-8'));
}

function salvarDados(dados) {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  const jogos = lerDados();

  // GET /jogos
  if (req.method === 'GET' && pathname === '/jogos') {
    let resultado = jogos;

    if (query.titulo) {
      resultado = resultado.filter(j => j.titulo.toLowerCase().includes(query.titulo.toLowerCase()));
    }
    if (query.genero) {
      resultado = resultado.filter(j => j.genero === query.genero);
    }
    if (query.ano) {
      resultado = resultado.filter(j => j.ano == query.ano);
    }
    if (query.plataforma) {
      resultado = resultado.filter(j => j.plataforma === query.plataforma);
    }

    return send(res, 200, resultado);
  }

  // GET /jogos/:id
  if (req.method === 'GET' && pathname.startsWith('/jogos/')) {
    const id = parseInt(pathname.split('/')[2]);
    const jogo = jogos.find(j => j.id === id);

    if (!jogo) return send(res, 404, { erro: "Jogo não encontrado" });

    return send(res, 200, jogo);
  }

  // POST /jogos
  if (req.method === 'POST' && pathname === '/jogos') {
    const body = await getBody(req);

    if (!body.titulo || !body.genero || !body.ano || !body.plataforma || !body.nota) {
      return send(res, 400, { erro: "Campos obrigatórios faltando" });
    }

    const novoId = jogos.length ? Math.max(...jogos.map(j => j.id)) + 1 : 1;

    const novo = { id: novoId, ...body };
    jogos.push(novo);
    salvarDados(jogos);

    return send(res, 201, novo);
  }

  // PUT /jogos/:id
  if (req.method === 'PUT' && pathname.startsWith('/jogos/')) {
    const id = parseInt(pathname.split('/')[2]);
    const body = await getBody(req);

    const index = jogos.findIndex(j => j.id === id);
    if (index === -1) return send(res, 404, { erro: "Jogo não encontrado" });

    jogos[index] = { id, ...body };
    salvarDados(jogos);

    return send(res, 200, jogos[index]);
  }

  // PATCH /jogos/:id
  if (req.method === 'PATCH' && pathname.startsWith('/jogos/')) {
    const id = parseInt(pathname.split('/')[2]);
    const body = await getBody(req);

    const jogo = jogos.find(j => j.id === id);
    if (!jogo) return send(res, 404, { erro: "Jogo não encontrado" });

    Object.assign(jogo, body);
    salvarDados(jogos);

    return send(res, 200, jogo);
  }

  // DELETE /jogos/:id
  if (req.method === 'DELETE' && pathname.startsWith('/jogos/')) {
    const id = parseInt(pathname.split('/')[2]);
    const index = jogos.findIndex(j => j.id === id);

    if (index === -1) return send(res, 404, { erro: "Jogo não encontrado" });

    jogos.splice(index, 1);
    salvarDados(jogos);

    res.writeHead(204);
    return res.end();
  }

  // GET /estatisticas
  if (req.method === 'GET' && pathname === '/estatisticas') {
    const total = jogos.length;
    const mediaNotas = jogos.reduce((s, j) => s + j.nota, 0) / total;

    const porGenero = {};
    jogos.forEach(j => {
      porGenero[j.genero] = (porGenero[j.genero] || 0) + 1;
    });

    const maiorNota = jogos.reduce((a, b) => a.nota > b.nota ? a : b);
    const jogoMaisAntigo = jogos.reduce((a, b) => a.ano < b.ano ? a : b);

    return send(res, 200, { total, mediaNotas, porGenero, maiorNota, jogoMaisAntigo });
  }

  send(res, 404, { erro: "Rota não encontrada" });
});

server.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
