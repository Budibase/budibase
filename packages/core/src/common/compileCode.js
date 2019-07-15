import { 
  compileExpression as cExp, 
  compileCode as cCode 
} from '@nx-js/compiler-util';

export const compileCode = code => {
  let func;  
    
  try {
    func = cCode(code);
  } catch(e) {
    e.message = `Error compiling code : ${code} : ${e.message}`;
    throw e;
  }

  return func;
}

export const compileExpression = code => {
  let func;  
      
  try {
    func = cExp(code);
  } catch(e) {
    e.message = `Error compiling expression : ${code} : ${e.message}`;
    throw e;
  }
  
  return func;
}
