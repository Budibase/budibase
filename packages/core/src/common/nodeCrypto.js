import bcrypt from "bcryptjs"; 

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function verify(password, hash) {
    return bcrypt.compareSync(password, hash);
}


export default {
    hash, verify
};