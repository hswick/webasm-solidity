# Truebit On-Chain Interpreter

## WASM Interpreter written in Solidity

This is the WASM interpreter that Truebit uses for the dispute resolution layer of the protocol. Here the solver and 
verifier compute each step to play the verification game and then they run the final step to decide who wins the game

## Installation
Make sure you have truffle and ganache-cli installed locally and the latest version of node

```
npm install -g truffle ganache-cli
```

## Testing

```
truffle test
```