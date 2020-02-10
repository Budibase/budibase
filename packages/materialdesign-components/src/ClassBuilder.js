export default class ClassBuilder {
  constructor(block, defaultIgnoreList) {
    this.block = `mdc-${block}`;
    this.defaultIgnoreList = defaultIgnoreList; //will be ignored when building custom classes
  }

  /* 
  handles both blocks and elementss (BEM MD Notation) 
  params = {elementName: string, props: {modifiers{}, customs:{}, extras: []}}
  All are optional 
  */
  build(params) {
    if (!params) return this.block; //return block if nothing passed
    const { props, elementName } = params;
    let base = !!elementName ? `${this.block}__${elementName}` : this.block;
    if (!props) return base;
    return this._handleProps(base, props);
  }

  //Easily grab a simple element class
  elem(elementName) {
    return this.build({ elementName });
  }

  //use if a different base is needed than whats defined by this.block
  debase(base, elementProps) {
    if (!elementProps) return base;
    return this._handleProps(base, elementProps);
  }

  //proxies bindProps and checks for which elementProps exist before binding
  _handleProps(base, elementProps) {
    let cls = base;
    const { modifiers, customs, extras } = elementProps;
    if (!!modifiers) cls += this._bindProps(modifiers, base);
    if (!!customs) cls += this._bindProps(customs, base, true);
    if (!!extras) cls += ` ${extras.join(" ")}`;
    return cls.trim();
  }

  /* 
  Handles both modifiers and customs. Use property, value or both depending 
  on whether it is passsed props for custom or modifiers
  if custom uses the following convention for scss mixins:
  bbmd-{this.block}--{property}-{value}
  bbmd-mdc-button--size-large
   */
  _bindProps(elementProps, base, isCustom = false) {
    return Object.entries(elementProps)
      .map(([property, value]) => {
        //disregard falsy and values set by defaultIgnoreList constructor param
        if (
          !!value &&
          (!this.defaultIgnoreList || !this.defaultIgnoreList.includes(value))
        ) {
          let classBase = isCustom ? `bbmd-${base}` : `${base}`;
          let valueType = typeof value;

          if (valueType == "string" || valueType == "number") {
            return isCustom
              ? ` ${classBase}--${property}-${value}`
              : ` ${classBase}--${value}`;
          } else if (valueType == "boolean") {
            return ` ${classBase}--${property}`;
          }
        }
      })
      .join("");
  }
}
