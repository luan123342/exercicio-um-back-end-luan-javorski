
const fs = require('fs');
const path = require('path');

const caminho = path.join(__dirname, 'filmes.json');

let catalogoFilmes = [
    { id: 1, titulo: "Matrix", ano: 1999, diretor: "Lana Wachowski", genero: "Ficção", nota: 4.8 },
    { id: 2, titulo: "Titanic", ano: 1997, diretor: "James Cameron", genero: "Romance", nota: 4.5 },
    { id: 3, titulo: "Toy Story", ano: 1995, diretor: "John Lasseter", genero: "Animação", nota: 4.7 },
    { id: 4, titulo: "O Poderoso Chefão", ano: 1972, diretor: "Francis Ford Coppola", genero: "Drama", nota: 4.9 },
    { id: 5, titulo: "Star Wars", ano: 1977, diretor: "George Lucas", genero: "Ficção", nota: 4.6 }
];

// Converter para JSON
const jsonString = JSON.stringify(catalogoFilmes, null, 2);
console.log("JSON formatado:");
console.log(jsonString);
console.log("Tipo:", typeof jsonString);

// Simular API
const novosFilmesJSON = JSON.stringify([
    { id: 6, titulo: "Avatar", ano: 2009, diretor: "James Cameron", genero: "Ficção", nota: 4.4 },
    { id: 7, titulo: "Vingadores", ano: 2012, diretor: "Joss Whedon", genero: "Ação", nota: 4.3 },
    { id: 8, titulo: "Shrek", ano: 2001, diretor: "Andrew Adamson", genero: "Animação", nota: 4.6 }
]);

const novosFilmes = JSON.parse(novosFilmesJSON);
catalogoFilmes = catalogoFilmes.concat(novosFilmes);

// Buscar por ID
function buscarFilmePorId(id) {
    return catalogoFilmes.find(f => f.id === id) || null;
}

console.log("Buscar ID 2:", buscarFilmePorId(2));
console.log("Buscar ID 99:", buscarFilmePorId(99));

// Buscar por gênero
function buscarPorGenero(genero) {
    return catalogoFilmes.filter(f => f.genero === genero);
}

console.log("Filmes de Ficção:", buscarPorGenero("Ficção"));

// Salvar em arquivo
fs.writeFileSync(caminho, JSON.stringify(catalogoFilmes, null, 2));

// Ler novamente
const dadosLidos = JSON.parse(fs.readFileSync(caminho, 'utf-8'));
console.log("Dados lidos do arquivo:", dadosLidos);

// Criar fichas
const fichas = catalogoFilmes.map(f => 
`${f.titulo} (${f.ano}) - Dirigido por ${f.diretor}
Gênero: ${f.genero} | Nota: ${f.nota}/5.0`
);

console.log("Fichas dos filmes:");
fichas.forEach(f => console.log("\n" + f));
