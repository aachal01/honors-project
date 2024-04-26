const certificateObject = {
    "id": "6115c7fda3c5b327f444720c9ca6e4b8",
    "issuedTo": "ethereum address",
    "data": {
      "isMasked": false,
      "type": "map",
      "value": [
        {
          "key": "string_key",
          "isMasked": false,
          "type": "string",
          "value": "string_value",
          "id": "90dbe77145aa1e7673b5cb9861ee35dc"
        },
        {
          "key": "number_key",
          "isMasked": false,
          "type": "number",
          "value": 12345678,
          "id": "1dacb9dc983fa5effc45cadee3712955"
        },
        {
          "key": "boolen_key",
          "isMasked": false,
          "type": "boolean",
          "value": true,
          "id": "6f4c8314b9e19d107ddc8f93c41c1de0"
        },
        {
          "key": "map_key",
          "isMasked": false,
          "type": "map",
          "value": [
            {
              "key": "key1",
              "isMasked": false,
              "type": "string",
              "value": "value1",
              "id": "e6e69ab099239b84e3bb6918bd59c2d6"
            },
            {
              "key": "key2",
              "isMasked": false,
              "type": "string",
              "value": "value2",
              "id": "69389cfaa7e6f2ca6d9c64a0e937e85c"
            }
          ],
          "id": "2556e710f018432766acac258dd0fdd0"
        },
        {
          "key": "array_key",
          "isMasked": false,
          "type": "array",
          "value": [
            {
              "isMasked": false,
              "type": "string",
              "value": "val1",
              "id": "cd8dda70f2a581d6ef4b53eb839d7981"
            },
            {
              "isMasked": false,
              "type": "number",
              "value": 12345678,
              "id": "de63f1511b025917b5f087bb5bea5edc"
            },
            {
              "isMasked": false,
              "type": "boolean",
              "value": true,
              "id": "f7777cca2ccc2fc23ddc30f4c174c35f"
            },
            {
              "isMasked": false,
              "type": "map",
              "value": [
                {
                  "key": "key1",
                  "isMasked": false,
                  "type": "string",
                  "value": "value1",
                  "id": "678fae607eb3b1b38d5f53ad4abd0300"
                }
              ],
              "id": "cab932e1d726edfaec274e80745786ac"
            },
            {
              "isMasked": false,
              "type": "array",
              "value": [
                {
                  "isMasked": false,
                  "type": "number",
                  "value": 1,
                  "id": "142bc774cd241c679d5a271cd0b28426"
                }
              ],
              "id": "7fe0f69956d6d1f86b5acd3e3f36832f"
            }
          ],
          "id": "b9acc39fe726bb4d1bc2477d61f74b24"
        }
      ],
      "id": "59d67955d997704b76d194408a030c64"
    }
  }
  
  const maskKeys = [
    "",
  ]

const crypto = require('crypto');
async function maskCertificate(certificateObject, maskKeys) {
  const salt = certificateObject.id; // Using certificate ID as salt
  const maskedCertificateObject = { ...certificateObject }; // Create a copy of the original object
  
  // Helper function to generate hash using SHA256 algorithm and salt
  function generateHash(value) {
    const hash = crypto.createHmac('sha256', salt).update(value.toString()).digest('hex');
    return hash;
  }

  function finalHash(obj) {
    if (obj && typeof obj === 'object') {
      if (Array.isArray(obj.value)) {
        const hashes = obj.value.map(finalHash);
        const concatenatedHash = hashes.join('');
        return generateHash(concatenatedHash);
      } else {
        const valuesHash = Object.values(obj).map(finalHash).join('');
        return generateHash(valuesHash);
      }
    } else {
      return generateHash(obj.toString());
    }
  }

  // Recursive function to traverse and mask values based on maskKeys
  function maskValue(obj) {
    if (obj && typeof obj === 'object') {
      if (obj.id && maskKeys.includes(obj.id)) {
        // Mask the value
        obj.isMasked = true;
        obj.hash = generateHash(obj.value);
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

  maskValue(maskedCertificateObject.data); // Start masking from the 'data' property
  const finalCertificateHash = finalHash(maskedCertificateObject.data); // Calculate the final hash

  maskedCertificateObject.finalHash = finalCertificateHash; // Add the final hash to the object

  return maskedCertificateObject;
}

// Test the function
maskCertificate(certificateObject, maskKeys)
  .then(maskedCertificate => {
    console.log(JSON.stringify(maskedCertificate, null, 2));
  })
  .catch(error => {
    console.error('Error masking certificate:', error);
  });
