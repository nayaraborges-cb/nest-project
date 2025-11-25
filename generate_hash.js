// Script para gerar o hash da senha de teste
// Certifique-se de que a biblioteca 'bcrypt' está instalada no seu projeto.

const bcrypt = require('bcrypt');

// A senha que você está usando no Thunder Client
const password = '125Pato'; 
const saltRounds = 10; // O mesmo valor usado no seu UsersService.create

async function generateHash() {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log(`Senha original: ${password}`);
        console.log(`Hash gerado: ${hash}`);
        console.log('\nCOPIE O HASH ACIMA E COLE NO SEU ARRAY DE TESTE.');
    } catch (error) {
        console.error('Erro ao gerar o hash:', error);
    }
}

generateHash();