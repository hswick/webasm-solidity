const Judge = artifacts.require('Judge')
const dataFolder = __dirname + '/data'
const fs = require('fs');

contract('Judge', async (accounts) => {

  const phase_table = {
    0: "fetch",
    1: "init",
    2: "reg1",
    3: "reg2",
    4: "reg3",
    5: "alu",
    6: "write1",
    7: "write2",
    8: "pc",
    9: "stack_ptr",
    10: "call_ptr",
    11: "memsize"
  }

  context('running multiple test files', async () => {

    before(async () => {
      judge = await Judge.new()
    })

    const judgePhase = async (testData, phase) => {
      return new Promise(async (resolve, reject) => {
        let proof = testData[phase_table[phase]]
        let merkle = (proof.merkle && proof.merkle.list) || proof.location || []
        let loc = (proof.merkle && proof.merkle.location) || 0
        let m = proof.machine || {reg1:0, reg2:0, reg3:0, ireg:0, vm:"0x00", op:"0x00"}
  
        if (phase == 5 || phase == 1) m = proof
        let vm
        if (typeof proof.vm != "object") {
          vm = { 
            code: "0x00", 
            stack:"0x00",
            call_stack:"0x00", 
            calltable:"0x00",
            globals : "0x00",
            memory:"0x00",
            calltypes:"0x00",
            input_size:"0x00", 
            input_name:"0x00",
            input_data:"0x00",
            pc:0,
            stack_ptr:0, 
            call_ptr:0,
            memsize:0
          }
        } else { vm = proof.vm }

        let registers = [m.reg1, m.reg2, m.reg3, m.ireg]
        let roots = [vm.code, vm.stack, vm.memory, vm.call_stack, vm.globals, vm.calltable, vm.calltypes, vm.input_size, vm.input_name, vm.input_data]
        let pointers = [vm.pc, vm.stack_ptr, vm.call_ptr, vm.memsize]

        try {
          let result = await judge.judge.call(
            testData.states, 
            phase,
            merkle,
            m.vm,
            m.op,
            registers,
            roots,
            pointers
          )
          resolve(result.toNumber())
        } catch(e) {
          reject(e)
        }
        resolve()
      })
    }

    fs.readdirSync(dataFolder).forEach(async (file) => {
      it('should test the WASM judge on file ' + file, async () => {
        let testData = JSON.parse(fs.readFileSync(__dirname+'/data/'+file))
        //12 phases
        for(i = 0; i < 12; i++) {
          assert.equal(await judgePhase(testData, i), i)
        }
      })
    })
  })
})