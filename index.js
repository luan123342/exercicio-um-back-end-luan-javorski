
const fs = require('fs');
const path = require('path');

const caminho = path.join(__dirname, 'dados', 'produtos.json');

function lerDados() {
  const dados = fs.readFileSync(caminho, 'utf-8');
  return JSON.parse(dados);
}

function salvarDados(dados) {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}

function listarProdutos() {
  const produtos = lerDados();
  console.table(produtos);

  const total = produtos.reduce((soma, p) => soma + (p.preco * p.estoque), 0);
  console.log("Valor total em estoque: R$", total);
}

function adicionarProduto(nome, preco, estoque) {
  const produtos = lerDados();
  const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;

  const novoProduto = { id: novoId, nome, preco, estoque };
  produtos.push(novoProduto);

  salvarDados(produtos);
  console.log("Produto adicionado com sucesso!");
}

function buscarProduto(id) {
  const produtos = lerDados();
  const produto = produtos.find(p => p.id === id);

  if (produto) {
    console.log(produto);
  } else {
    console.log("Produto não encontrado!");
  }
}

function atualizarEstoque(id, quantidade) {
  const produtos = lerDados();
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    console.log("Produto não encontrado!");
    return;
  }

  console.log("Antes:", produto.estoque);
  produto.estoque = quantidade;
  console.log("Depois:", produto.estoque);

  salvarDados(produtos);
}

function removerProduto(id) {
  let produtos = lerDados();
  const novoArray = produtos.filter(p => p.id !== id);

  if (produtos.length === novoArray.length) {
    console.log("Produto não encontrado!");
    return;
  }

  salvarDados(novoArray);
  console.log("Produto removido com sucesso!");
}

function produtosEmFalta(limite) {
  const produtos = lerDados();
  const faltando = produtos.filter(p => p.estoque < limite);

  if (faltando.length === 0) {
    console.log("Nenhum produto em falta.");
  } else {
    console.table(faltando);
    console.log("Sugestão: fazer novo pedido!");
  }
}

// Exemplo de uso:
listarProdutos();
// adicionarProduto("Monitor", 900, 5);
// buscarProduto(1);
// atualizarEstoque(2, 20);
// removerProduto(3);
// produtosEmFalta(15);
