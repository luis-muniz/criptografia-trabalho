const fs = require('fs');
var readline = require('readline');

main()

async function main() {
  
  const caracteresValidos = "abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVXWYZ,.?! "
  const caracteresValidosEmCodASCII = separaCaracteresEmCodASCII(caracteresValidos)

  const textoEncriptado1 = await readFile('out02-1.txt')
  const textoEncriptado2 = await readFile('out02-2.txt')

  const textoEncriptado1SeparadoHex = separaEmUmArrayDeHex(textoEncriptado1)
  const textoEncriptado2SeparadoHex = separaEmUmArrayDeHex(textoEncriptado2)

  const textoEncriptado1SeparadoCodASCII = converteHexParaCodASCII(textoEncriptado1SeparadoHex)
  const textoEncriptado2SeparadoCodASCII = converteHexParaCodASCII(textoEncriptado2SeparadoHex)

  const m1 = []
  const m2 = []

  for (let i = 0; i < 76; i++) {
    m1.push(`-`.charCodeAt(0))
    m2.push(`-`.charCodeAt(0))
  }

  while (true) {
    const digitadas = []

    // Limpa o console -> Apenas para Linux
    // console.log('\033[2J');

    printM1M2(m1, m2)


    const palavra = await lerPalavra("Digite uma palavra para testar:");
    for (let i = 0; i < palavra.length; i++) {
      digitadas.push(palavra[i].charCodeAt(0))
    }

    for (let i = 0; i <= textoEncriptado1SeparadoCodASCII.length - digitadas.length; i++) {
      const arrayC1iXORC2i = []
      for (let j = i; j < i + digitadas.length; j++) {
        const xor = textoEncriptado1SeparadoCodASCII[j] ^ textoEncriptado2SeparadoCodASCII[j]
        arrayC1iXORC2i.push(xor)
      }
      // console.log(arrayC1iXORC2i)
      let contemInvalido = false
      for (let j = 0; j < arrayC1iXORC2i.length; j++) {
        const m2XORC1iXORC2i = arrayC1iXORC2i[j] ^ digitadas[j]
        if (!caracteresValidosEmCodASCII.includes(m2XORC1iXORC2i)) {
          contemInvalido = true;
          break
        }
      }
      if (!contemInvalido) {
        let k = i
        let srt = ""
        for (let j = 0; j < arrayC1iXORC2i.length; j++) {
          srt = `${srt}${String.fromCharCode(arrayC1iXORC2i[j] ^ digitadas[j])}`
        }
        console.log(`Indice ${k.toString().padStart(2," ")}:<${srt}>`)
        k++
      }
    }

    const op = await lerPalavra("Você quer salvar alguma combinação? [y/n]");
    if (op === "y") {
      const indice = await lerPalavra("Digite o indice da combinação que quer mudar:");
      const indiceInt = parseInt(indice)
      const msg = await lerPalavra("Qual a mensagem que você quer gravar a mensagem? [m1/m2]");
      if (msg === "m1") {
        for (let i = 0; i < digitadas.length; i++) {
          m1.splice(indiceInt + i,1,digitadas[i])
          const xor = textoEncriptado1SeparadoCodASCII[indiceInt + i] ^ textoEncriptado2SeparadoCodASCII[indiceInt + i]
          m2.splice(indiceInt + i,1,xor ^ digitadas[i])
        }
      } else if (msg === "m2") {
        for (let i = 0; i < digitadas.length; i++) {
          m2.splice(indiceInt + i,1,digitadas[i])
          const xor = textoEncriptado1SeparadoCodASCII[indiceInt + i] ^ textoEncriptado2SeparadoCodASCII[indiceInt + i]
          m1.splice(indiceInt + i,1,xor ^ digitadas[i])
        }
      }
    }
  }
}

function printM1M2(m1, m2) {
  let m1Str = ""
  let indice = ""
  let m2Str = ""
  for (let i = 0; i < 76; i++) {
    m1Str = `${m1Str}${String.fromCharCode(m1[i]).padStart(3,' ')}`
    indice = `${indice}${i.toString().padStart(3,' ')}`
    m2Str = `${m2Str}${String.fromCharCode(m2[i]).padStart(3,' ')}`
  }

  console.log("" + m1Str)
  console.log("" + indice)
  console.log("" + m2Str)
  console.log()
}

function lerPalavra(question) {

  var leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    // retornando uma Promise (objeto para processamento assíncrono)
    leitor.question(`${question}\n`, answer => {
      // função responsável por exibir primeiro argumento e retornar uma função callback para capturar leitura de dados do teclado
      resolve(answer); // resposta da Promise
      leitor.close(); // encerrando leitura de dados
    });
  });
}

function separaCaracteresEmCodASCII(texto) {
  const array = []
  for (let i = 0; i < texto.length; i++) {
    array.push(texto.charAt(i).charCodeAt(0))
  }
  return array
}

function separaEmUmArrayDeHex(texto) {
  const arrayHex = []
  for (let i = 0; i < texto.length - 1; i = i + 2) {
    arrayHex.push(texto.substr(i, 2))
  }
  return arrayHex
}

function converteHexParaCodASCII(arrayHex) {
  const arrayASCII = []
  for (let i = 0; i < arrayHex.length; i++) {
    arrayASCII.push(parseInt(arrayHex[i], 16))
  }
  return arrayASCII
}

async function readFile(filename) {
  const data = await fs.promises.readFile(filename, 'utf-8')
  return data
}
