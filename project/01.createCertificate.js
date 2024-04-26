const { readCertificateData, saveCertificate } = require("./common/fs");
const { log, generateSalt } = require("./common/utils");
const { saveToBlockchain } = require("./common/web3");

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

async function main() {
  const certificateData = await readCertificateData()
  const certificate = await createCertificate(certificateData)
  certificate.issuedTo = "0x33619124Ae8c037BfA137138220Cf3ac49CA58f3"
  await saveCertificate(certificate);
  await saveToBlockchain(certificate);
}

main()