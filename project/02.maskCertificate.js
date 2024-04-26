const { readCertificate, saveMaskedCertificate } = require("./common/fs");
const { treeHash } = require("./common/utils");

async function maskCertificate(certificateObject, maskKeys) {
  const maskedCertificateObject = structuredClone(certificateObject); // Create a copy of the original object

  // Recursive function to traverse and mask values based on maskKeys
  async function maskValue(obj) {
    if (typeof obj !== 'object')
      throw new Error('Invalid Object to Mask')

    if (maskKeys.includes(obj.id)) {
      // Mask the value
      obj.hash = await treeHash(obj);
      obj.isMasked = true;
      delete obj.value;
      delete obj.key;
      delete obj.type; // Remove the original value
    } else if (Array.isArray(obj.value)) {
      for (let i = 0; i < obj.value.length; i++) {
        const entry = obj.value[i];
        await maskValue(entry, maskKeys);
      }
    }
  }
  await maskValue(maskedCertificateObject.data);

  return maskedCertificateObject;
}

async function main(maskKeys) {
  const certificate = await readCertificate();
  const maskedCertificate = await maskCertificate(certificate, maskKeys)
  await saveMaskedCertificate(maskedCertificate);
}

const maskKeys = [
  "b057f197bd9a48d521cf",
  "262929cd0d77e2421ddc",
]

main(maskKeys)