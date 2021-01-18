const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ]);

function sha256(inBuffer, outBuffer) {
  // Both input and output are ArrayBufer.
  // And output length must be 256bit = 32byte.
  const rotR=(v, n)=>( (v>>>n) | (v<<(32-n)) );
  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]);
  let i = 0;
  let j = 0;

  // Make message buffer at first.
  const inputLen = inBuffer.byteLength;
  const rest = (inputLen + 1) % 64;
  const messageLen = ((rest < 56) ? 
                      (inputLen+(65-rest)) :
                      (inputLen+(129-rest))
                     ) / 4;
  const message = new Uint32Array(messageLen);

  // Fill message with input and padding.
  const msgDV = new DataView(message.buffer);
  const input = new Uint8Array(inBuffer);
  while (i < inputLen) {msgDV.setUint8(i, input[i]); i++;}
  i=0;
  msgDV.setUint8(inputLen,0x80);
  msgDV.setUint32((messageLen-1)*4, inputLen*8);

  // Taking care of endian.
  while (i < messageLen) {
    message[i] = msgDV.getUint32(i*4);
    i++;
  }
  i=0;
  

  // Processing.
  const W = new Uint32Array(64);
  const temps = new Uint32Array(10); // (0~7 for a,b,c..h), (8,9 for temp1, temp2);
  while (j < messageLen) {
    while (i < 16) {
      W[i] = message[j + i];
      i++;
    }
    while (i < 64) {
      W[i] = W[i-16];
      W[i] += (rotR(W[i-15], 7) ^ (rotR(W[i-15], 18)) ^ (W[i-15] >>> 3));
      W[i] += W[i-7];
      W[i] += (rotR(W[i-2], 17) ^ (rotR(W[i-2],  19)) ^ (W[i-2] >>> 10));
      i++;
    };
    i=0;

    temps[0] = h[0]; //a
    temps[1] = h[1]; //b
    temps[2] = h[2]; //c..
    temps[3] = h[3];
    temps[4] = h[4];
    temps[5] = h[5];
    temps[6] = h[6];
    temps[7] = h[7]; //h

    while (i < 64) {
      // h , Sigma0, Ch
      temps[8] = temps[7] // h
      temps[8] += (rotR(temps[4], 6) ^ rotR(temps[4], 11) ^ rotR(temps[4], 25));//Sigma1
      temps[8] += (temps[4] & temps[5]) ^ (~temps[4] & temps[6]); // Ch
      temps[8] += K[i];
      temps[8] += W[i];
      // Sigma1 and Maj.
      temps[9] = (rotR(temps[0], 2) ^ rotR(temps[0], 13) ^ rotR(temps[0], 22));
      temps[9] += (temps[0] & temps[1]) ^ (temps[0] & temps[2]) ^ (temps[1] & temps[2]);

      temps[7] = temps[6];
      temps[6] = temps[5];
      temps[5] = temps[4];
      temps[4] = temps[3];
      temps[4] += temps[8]; // e = d + temp1
      temps[3] = temps[2];
      temps[2] = temps[1];
      temps[1] = temps[0];
      temps[0] = temps[8];
      temps[0] += temps[9]; // a = temp1 + temp2

      i++;
    }

    h[0] += temps[0];
    h[1] += temps[1];
    h[2] += temps[2];
    h[3] += temps[3];
    h[4] += temps[4];
    h[5] += temps[5];
    h[6] += temps[6];
    h[7] += temps[7];

    j += 16;
  }

  const result = new DataView(outBuffer);
  result.setUint32(0, h[0]);
  result.setUint32(4, h[1]);
  result.setUint32(8, h[2]);
  result.setUint32(12, h[3]);
  result.setUint32(16, h[4]);
  result.setUint32(20, h[5]);
  result.setUint32(24, h[6]);
  result.setUint32(28, h[7]);
  }

// Helper Functions.
function to32b(buf) {
  const bits = new Array(32);
  const result = [];
  let i;
  for(let fourbyte of new Uint32Array(buf)) {
    i = 0;
    while (i < 32) {
      bits[i] = ( (fourbyte >>> (31 - i)) & 0x01)? '1':'0';
      i++;
    }
    result.push(bits.join(''));
  }
  return result.join(' ');
}

function tohex(b, capital) {
  // buffer to hex.
  const view = new Uint8Array(b);
  let HexTable;
  if (capital) {
    HexTable = {
      0:'0',1:'1',2:'2',3:'3',4:'4',
      5:'5',6:'6',7:'7',8:'8',9:'9',
      10: 'A', 11: 'B', 12: 'C',
      13: 'D', 14: 'E', 15: 'F',
    }
  } else {
    HexTable = {
      0:'0',1:'1',2:'2',3:'3',4:'4',
      5:'5',6:'6',7:'7',8:'8',9:'9',
      10: 'a', 11: 'b', 12: 'c',
      13: 'd', 14: 'e', 15: 'f',
    }
  }
  let result = [];
  for (let uint of view) {
    result.push(HexTable[uint >>> 4]);
    result.push(HexTable[uint & 0x0f]);
    result.push('');
  }
  return result.join('');
}


// Tests
const ecd = new TextEncoder();
const hash = new ArrayBuffer(32);

// test with empty input.
let input = ecd.encode("");
sha256(input.buffer, hash);
if (tohex(hash) !== "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") {
  alert("test failed!");
}

console.log(to32b(hash));
console.log(tohex(hash));

// test with "abc" string
input = ecd.encode("abc");
sha256(input.buffer, hash);
if (tohex(hash) !== "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad") {
  alert("test failed!");
}

// test with "hello world" string
input = ecd.encode("hello world");
sha256(input.buffer, hash);
if (tohex(hash, Capital=true) !== "B94D27B9934D3E08A52E52D7DA7DABFAC484EFE37A5380EE9088F7ACE2EFCDE9") {
  alert("test failed!");
}
