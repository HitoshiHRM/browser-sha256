/*==                  ====
==== Tests using jest ====
====                  ==*/
const {sha256, to32b, tohex} = require('./hash.js');

const ecd    = new TextEncoder();
const result = new ArrayBuffer(32);

test('[Hex]Check a hash of : ""', ()=>{
  const empty = ecd.encode("");
  sha256(empty.buffer, result);

  expect(
    tohex(result)
  ).toBe(
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  )
});
test('[Bit]Check a hash of : ""', ()=>{
  const empty = ecd.encode("");
  sha256(empty.buffer, result);

  expect(
    to32b(result)
  ).toBe(
    "01000010110001001011000011100011 00010100000111001111110010011000 " +
    "11001000111101001111101110011010 00100100101110010110111110011001 " +
    "11100100010000011010111000100111 01001100100100111001101101100100 " +
    "00011011100110011001010110100100 01010101101110000101001001111000"
  )
});
test('[Hex]Check a hash of : "abc"', ()=>{
  const abc = ecd.encode("abc");
  sha256(abc.buffer, result);

  expect(
    tohex(result)
  ).toBe(
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
  )
});
test('[Hex]Check a hash of : "hello world"', ()=>{
  const word = ecd.encode("hello world");
  sha256(word.buffer, result);

  expect(
    tohex(result, capital = true)
  ).toBe(
    "B94D27B9934D3E08A52E52D7DA7DABFAC484EFE37A5380EE9088F7ACE2EFCDE9"
  )
});