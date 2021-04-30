# didgen

## Install

```
npm install
npm link
```


## Run

Generate a did:web DID:
```
didgen -w <url>
```

Generate a did:key DID:
```
didgen -k
```

Generate and parse public did document with jq:
```
didgen -w https://example.com > out.json
cat out.json | jq '.didDocument'
```

Generate and parse unlocked did document with jq:
```
didgen -w https://example.com > out.json
cat out.json | jq '.unlockedDidDocument'
```

Make sure you don't share the unlocked did document