import { ILargeLanguageModel } from "./"
import * as llama from "node-llama-cpp"

class LlamaCpp implements ILargeLanguageModel {
  https://petstore.swagger.io/?url=https://lite.koboldai.net/kobold_api.json
  https://js.langchain.com/docs/integrations/llms/llama_cpp

}
// import {fileURLToPath} from "url";
// import path from "path";
// import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";
//
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
//
// const model = new LlamaModel({
//   modelPath: path.join(__dirname, "models", "codellama-13b.Q3_K_M.gguf")
// });
// const context = new LlamaContext({model});
// const session = new LlamaChatSession({context});
//
//
// const q1 = "Hi there, how are you?";
// console.log("User: " + q1);
//
// const a1 = await session.prompt(q1);
// console.log("AI: " + a1);
//
//
// const q2 = "Summerize what you said";
// console.log("User: " + q2);
//
// const a2 = await session.prompt(q2);
// console.log("AI: " + a2);
