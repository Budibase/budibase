export function summarizeText(text: string) {
  return `Summarize this text:\n${text}. \nOnly return the summary.`
}

export function classifyText(text: string, categories: string[]) {
  return `Return the category of this text: "${text}". Based on these categories: ${categories.join(
    ", "
  )}. Only return the category.`
}

export function cleanData(text: string) {
  return `Clean the following string: "${text}". Remove any spelling mistakes or data issues. Only return the cleaned string itself and nothing else.`
}

export function generateSQL(prompt: string, tableSchema: string) {
  return `Given the table schema:\n${tableSchema}\n\nGenerate a SQL query for the following request:\n${prompt}.\n Only provide the SQL.`
}

export function generateCode(prompt: string) {
  return `Generate JavaScript code for the following request:\n${prompt}.\n Only provide the JS and nothing else.`
}

export function generateCronExpression(text: string) {
  return `Generate a node-cron compatible expression based on the following prompt. Return only the cron expression (without backticks), and if not possible return only 'Error generating cron' with a short explanation:\n${text}`
}

export function translate(text: string, language: string) {
  return `Translate the following text: "${text}" into ${language}. Only return the translation.`
}

export function sentimentAnalysis(text: string) {
  return `Return the sentiment of this text: "${text}". Only return the sentiment.`
}

export function searchWeb(text: string) {
  return `Search the web for the following: "${text}". Only return the top results.`
}
