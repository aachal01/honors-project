const bcrypt = require('bcryptjs');

async function generateSalt() {
  return bcrypt.genSalt(10);
}

async function generateHash(data, salt) {
  return bcrypt.hash(data, salt);
}

async function treeHash(obj) {
  let hash = "";

  if (typeof obj !== 'object' || obj === null || obj === undefined)
      throw new Error('Invalid Certificate Entry')

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

async function createCertificate(jsonObj) {
    
  const certificateId = await generateSalt() // Generate a random id

  async function transformData(obj) {
      const id = await generateSalt(); // Generate a random id
      if (typeof obj === 'string') {
          return {
              isMasked: false,
              type: 'string',
              value: obj,
              id
          };
      } else if (typeof obj === 'number') {
          return {
              isMasked: false,
              type: 'number',
              value: obj,
              id
          };
      } else if (typeof obj === 'boolean') {
          return {
              isMasked: false,
              type: 'boolean',
              value: obj,
              id
          };
      } else if (Array.isArray(obj)) {
          const transformedArray = await Promise.all(obj.map(async (item, key) => ({
              key: String(key),
              ...(await transformData(item))
          })));
          return {
              isMasked: false,
              type: 'array',
              value: transformedArray,
              id
          };
      } else if (typeof obj === 'object' && obj !== null) {
          const transformedMap = await Promise.all(Object.entries(obj).map(async ([key, value]) => ({
              key,
              ...(await transformData(value))
          })));
          return {
              isMasked: false,
              type: 'map',
              value: transformedMap,
              id
          };
      } else {
          throw new Error('Unsupported data type');
      }
  }

  const transformedData = await transformData(jsonObj);
  
  const certificate = {
      id: certificateId,
      issuedTo: 'ethereum address',
      data: transformedData
  };

  return certificate;
}

async function maskCertificate(certificateObject, maskKeys) {
  const maskedCertificateObject = structuredClone(certificateObject); // Create a copy of the original object

  // Recursive function to traverse and mask values based on maskKeys
  function maskValue(obj) {
    if (obj && typeof obj === 'object') {
      if (obj.id && maskKeys.includes(obj.id)) {
        // Mask the value
        obj.isMasked = true;
        obj.hash = treeHash(obj.value);
        delete obj.value;
        delete obj.key;
        delete obj.type; // Remove the original value
      } else if (Array.isArray(obj.value)) {
        obj.value.forEach(maskValue); // Recursively process array elements
      } else {
        Object.values(obj).forEach(maskValue); // Recursively process object properties
      }
    }
  }
  maskValue(maskedCertificateObject.data);

  return maskedCertificateObject;
}

async function verifyCertificate(maskedCertificateObject) {
  // for each real values use salt from maskedCertificateObject to calculate hash
  // for each hash values use as it is
  // calculate final hash and verify from blockchain
  // return verification status
}

const certificateData = {
  "name": "Aachal Modak",
  "grades": 10,
  "dob": "1st Jan, 1995",
  "gender": "female",
  "isPassed": true,
  "awards": [
    "GHC",
    "Harvard WeCode"
  ]
};

function log(obj) {
  console.log(
    JSON.stringify(obj, null, 2)
  )
}

async function main() {
  const certificate = await createCertificate(certificateData)
  log(certificate);
}

main()