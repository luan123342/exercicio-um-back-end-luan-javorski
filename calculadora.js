// calculadora.js

// Pegando os argumentos da linha de comando
const args = process.argv.slice(2);

// Validação de quantidade de argumentos
if (args.length !== 3) {
    console.log("❌ Uso correto: node calculadora.js <numero1> <operador> <numero2>");
    process.exit();
}

let [num1, operador, num2] = args;

// Converter para número
num1 = Number(num1);
num2 = Number(num2);

// Validar números
if (isNaN(num1) || isNaN(num2)) {
    console.log("❌ Erro: Os valores precisam ser números válidos.");
    process.exit();
}

let resultado;

// Escolher operação
switch (operador) {
    case "+":
        resultado = num1 + num2;
        break;
    case "-":
        resultado = num1 - num2;
        break;
    case "*":
        resultado = num1 * num2;
        break;
    case "/":
        if (num2 === 0) {
            console.log("❌ Erro: Divisão por zero não é permitida.");
            process.exit();
        }
        resultado = num1 / num2;
        break;
    default:
        console.log("❌ Operador inválido. Use +, -, * ou /");
        process.exit();
}

// Exibir resultado
console.log(`✅ Resultado: ${num1} ${operador} ${num2} = ${resultado}`);
