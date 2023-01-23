const crypto = require("crypto");

const a= (crypto.randomBytes(20).toString("hex"));
const b = crypto.createHash("sha256").update(a).digest("hex");

console.log(a);
console.log(b);