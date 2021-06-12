# browser-sha256
Javascript code to calculate sha256 on browser, with taking care of the endian.

# Example
Input and output(hash value) both must be ArrayBuffer type.
And output lenght must be longer than 32byte = 256bit.
```javascript
const ecd = new TextEncoder();
let target = ecd.encode("");

const input = target.buffer;
const output= new ArrayBuffer(32);
```

Then just call function to write value into output buffer.
```javascript
sha256(input, output);
```

You can watch the value with helper function.
```javascript
to32b(output);
// => 
// 01000010110001001011000011100011 00010100000111001111110010011000
// 11001000111101001111101110011010 00100100101110010110111110011001 
// 11100100010000011010111000100111 01001100100100111001101101100100 
// 00011011100110011001010110100100 01010101101110000101001001111000

tohex(output);
// => 
// e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

# Test
When you wanna test, just `yarn install` and `yarn test`.
