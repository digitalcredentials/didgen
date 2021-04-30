#!/usr/bin/env node
import { program } from 'commander';

import { DidWebResolver } from '@interop/did-web-resolver'

import { Ed25519VerificationKey2020 }
  from '@digitalbazaar/ed25519-verification-key-2020'


const didKeyDriver = require('@digitalbazaar/did-method-key').driver();

import { CryptoLD } from 'crypto-ld'

const cryptoLd = new CryptoLD()
cryptoLd.use(Ed25519VerificationKey2020)

const SIGNING_KEY_MAP = {
  assertionMethod: 'Ed25519VerificationKey2020'
}

async function generateWeb(url: string) {
  try {
    const didWeb = new DidWebResolver({ cryptoLd });
    const { didDocument, keyPairs } = await didWeb.generate({ url: url, keyMap: SIGNING_KEY_MAP, cryptoLd: cryptoLd });
    const contexts = didDocument['@context'];
    // trim unused context
    contexts.splice(-1,1);

    const privateCopy = JSON.parse(JSON.stringify(didDocument));
    privateCopy.assertionMethod[0].privateKeyMultibase = keyPairs.entries().next().value[1].privateKeyMultibase;
    const result = {
      didDocument: didDocument,
      unlockedDidDocument: privateCopy
    }
    
    console.log(JSON.stringify(result, null, 2));

  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function generateKey() {
    // did:key method is generative, so we won't clean up / trim down the corresponding DID document
    const {
      didDocument, keyPairs
    } = await didKeyDriver.generate();
    
    const privateCopy = JSON.parse(JSON.stringify(didDocument));
    privateCopy.verificationMethod[0].privateKeyMultibase = keyPairs.entries().next().value[1].privateKeyMultibase;

    const result = {
      didDocument: didDocument,
      unlockedDidDocument: privateCopy
    }
    
    console.log(JSON.stringify(result, null, 2));
}




program
  .option('-w, --web <url>', 'generate did document for domain', generateWeb)
  .option('-k, --key', 'generate did key', generateKey);


program.parse(process.argv);

