function atob(...args) {
  return atobCB(...args)
}
function btoa(...args) {
  return btoaCB(...args)
}

class TextDecoder {
  constructorArgs

  constructor(...constructorArgs) {
    this.constructorArgs = constructorArgs
  }

  decode(...input) {
    return textDecoderCb({
      constructorArgs: this.constructorArgs,
      functionArgs: input,
    })
  }
}
