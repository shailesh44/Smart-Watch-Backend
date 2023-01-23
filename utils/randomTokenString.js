const crypto = require("crypto");

const randomTokenString = () => {
    return crypto.randomBytes(20).toString("hex");
}

module.exports = randomTokenString;