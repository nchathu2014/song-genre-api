const bcrypt = require('bcrypt');

//Salt is a random  code generated and it use to improve the password complexity
async function run() {
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash('1234', salt);
    console.log(hashPwd)
}

run();