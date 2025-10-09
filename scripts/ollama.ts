import fetch from "node-fetch";

export const OllamaProvider = {
  id: "ollama",
  name: "Ollama (Local)",

  // List models
  async listModels(baseUrl: string) {
    const res = await fetch(`${baseUrl}/api/list`);
    const data = await res.json();
    return data.models.map((m: any) => m.name);
  },

  // Chat / completion
  async chat(baseUrl: string, model: string, messages: {role:string, content:string}[]) {
    const body = {
      model,
      messages,
      stream: false,  // change to true if you want token streaming
    };

    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return data; // return chat response
  },

  // Health check
  async health(baseUrl: string) {
    try {
      const res = await fetch(`${baseUrl}/api/version`);
      if (res.ok) return { status: "ok", version: await res.text() };
      return { status: "error" };
    } catch (e) {
      return { status: "error", message: e.message };
    }
  },
};
