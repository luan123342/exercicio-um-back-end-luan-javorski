// hello.js

const os = require('os');

// Mensagem de boas-vindas personalizada
const nome = process.argv[2] || "Usuário";

console.log("👋 Olá, " + nome + "!");
console.log("Bem-vindo ao Node.js 🚀");

// Versão do Node.js
console.log("🔢 Versão do Node:", process.version);

// Sistema operacional
console.log("💻 Sistema Operacional:", os.platform());

// Caminho da pasta atual
console.log("📁 Diretório atual:", process.cwd());
