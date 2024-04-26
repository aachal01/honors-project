const crypto = require('crypto');

async function generateSalt() {
  return crypto.randomBytes(10).toString('hex');
}

async function generateHash(data, salt) {
  return crypto.createHash('sha256').update(salt).update(data).digest('hex');
}

async function treeHash(obj) {
  let hash = "";

  if (typeof obj !== 'object' || obj === null || obj === undefined) {
    throw new Error('Invalid Certificate Entry')
  }

  if (obj.isMasked) {
    hash = obj.hash;
  }
  else if (Array.isArray(obj.value)) {
    const hashes = await Promise.all(obj.value.map(treeHash));
    const concatenatedHash = hashes.join('#');
    hash = await generateHash(concatenatedHash, obj.id);
  } else {
    const value = obj.value;
    const key = obj.key ?? '';
    const salt = obj.id;
    hash = await generateHash(key + value, salt);
  }
  return hash;
}

async function certificateHash(maskedCertificate) {
  const id = maskedCertificate.id
  const certificateDataHash = await treeHash(maskedCertificate.data);
  const finalHash = await generateHash(certificateDataHash, id);
return finalHash;
}

function log(obj) {
  console.log(
    JSON.stringify(obj, null, 2)
  )
}

module.exports = {
  generateHash,
  generateSalt,
  treeHash,
  certificateHash,
  log
}