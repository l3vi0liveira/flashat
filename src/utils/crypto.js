const crypto = require("crypto");

const salt = "r37y65tgh098juy676";

exports.createHash = (password) => {
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const hasher = hash.digest("hex");

  return hasher
};

exports.compare = (password, payload) => {
    const senha = this.createHash(payload)

    if (password === senha) {
        return true
    }

    return false
};
