import streamlit as st
import google.generativeai as genai
import os
from PIL import Image
import speech_recognition as sr
from google.generativeai.types import GenerationConfig, Tool
import io

# --- Gemini API Configuration ---
# A more robust way to get the API key that handles local development without a secrets file.
api_key = None
try:
    # This will succeed when deployed to Streamlit Community Cloud or if a local secrets.toml exists.
    api_key = st.secrets.get("GEMINI_API_KEY")
except (FileNotFoundError, st.errors.StreamlitAPIException):
    # Fallback for local development when secrets.toml is not present.
    api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    st.error(
        "🚨 Gemini API key not found. "
        "Please set the GEMINI_API_KEY environment variable or add it to your Streamlit secrets.",
        icon="🚨"
    )
    st.stop()

genai.configure(api_key=api_key)

# --- Model Selection and Initialization ---
# A system instruction to guide the chatbot's behavior
SYSTEM_PROMPT = (
    "You were developed by 'Lord Ranjith Kumar'. "
    "When a user asks to create an image, call the image generation tool immediately without unnecessary conversation. "
    "You are a helpful, friendly, and highly intelligent AI assistant. "
    "Your capabilities are vast, covering fields like technology, programming, science, education, business, and general knowledge. "
    "When responding, always provide clear, accurate, and easy-to-understand answers. "
    "Use simple language, offer step-by-step explanations, and include examples when it helps with clarity. "
    "Maintain a polite and professional tone. "
    "If a question is outside your knowledge or you are uncertain, state it honestly rather than providing speculative information."
)

# Use the latest and most capable flash model
MODEL_NAME = "gemini-2.5-flash"

# --- Define Image Generation Tool (using Python dictionary for simplicity) ---
image_generation_tool = {
    "function_declarations": [
        {
            "name": "generate_images",
            "description": "Create images from a text prompt.",
            "parameters": {
                "type": "OBJECT",
                "properties": {"prompt": {"type": "STRING", "description": "The text prompt to generate images from."}},
            },
        }
    ]
}

model = genai.GenerativeModel(
    MODEL_NAME,
    system_instruction=SYSTEM_PROMPT,
    tools=[image_generation_tool]
)

# --- Streamlit App UI ---
st.set_page_config(page_title="Ranjith's client", page_icon="🤖")

st.title("🤖 Ranjith's Client chatbot")
st.caption(f"Powered by Google Gemini {MODEL_NAME}")

# Initialize chat session in Streamlit's session state if not already present
if "messages" not in st.session_state:
    st.session_state.messages = [
    {"role": "assistant", "content": "Hello! I am your AI assistant. How can I help you today?"}
]
if "chat_session" not in st.session_state:
    st.session_state.chat_session = model.start_chat(history=[])

# --- Core Functions ---
def handle_prompt(prompt_parts):
    """Handles user prompt, displays it, gets a response, and updates the chat."""
    # Display user message
    with st.chat_message("user", avatar="🧑‍💻"):
        for part in prompt_parts:
            if isinstance(part, dict) and part.get("type") == "image":
                st.image(part["data"], width=200)
            elif isinstance(part, str):
                st.markdown(part)

    st.session_state.messages.append({"role": "user", "content": prompt_parts})
    
    # Get and display assistant response
    with st.chat_message("assistant", avatar="🤖"):
        with st.spinner("Thinking..."):
            try:
                # Use streaming for a better user experience
                response = st.session_state.chat_session.send_message(
                    prompt_parts,
                    tool_config={"function_calling_config": "AUTO"},
                    stream=True
                )

                # Stream the response and handle function calls
                bot_reply = ""
                placeholder = st.empty()
                for chunk in response:
                    # Safely access candidates and parts
                    if not chunk.candidates or not chunk.candidates[0].content.parts:
                        continue

                    # Check for function calls
                    first_part = chunk.candidates[0].content.parts[0]
                    if (function_call := getattr(first_part, "function_call", None)) and function_call.name == "generate_images":
                        st.info("Generating images based on your prompt...")
                        # The full response is needed to get all image parts
                        display_generated_images(response)
                        # Since images are displayed, we can break the loop
                        return

                    if chunk.text:
                        bot_reply += chunk.text
                        placeholder.markdown(bot_reply + "▌")

                placeholder.markdown(bot_reply)
                if bot_reply:
                    st.session_state.messages.append({"role": "assistant", "content": bot_reply})
            except Exception as e:
                st.error(f"An error occurred: {e}")

def get_voice_input():
    """Captures and transcribes voice input."""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        st.info("Listening... Speak now!", icon="🎤")
        try:
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            st.info("Transcribing...", icon="✍")
            # Fetch your own API key from secrets for robust use
            google_speech_api_key = st.secrets.get("GOOGLE_SPEECH_API_KEY")
            if not google_speech_api_key:
                st.error("🚨 Google Speech API key not found. Please add it to your Streamlit secrets.")
                return None
            text = recognizer.recognize_google(audio, key=google_speech_api_key)
            st.success(f"You said: \"{text}\"")
            return text
        except sr.WaitTimeoutError:
            st.warning("No speech detected. Please try again.")
        except sr.UnknownValueError:
            st.error("Sorry, I could not understand the audio. Please speak clearly.")
        except sr.RequestError as e:
            st.error(f"Could not request results from Google Speech Recognition service; {e}")
    return None

def display_generated_images(response):
    """Displays images from a tool call response."""
    # The response contains the function call and the generated images.
    # We just need to find the image parts and display them.
    image_parts = [part for part in response.parts if "image" in part.mime_type]
    
    if image_parts:
        # Extract image data for display and for session state
        images_for_display = [Image.open(io.BytesIO(p.inline_data.data)) for p in image_parts]
        st.image(images_for_display)

        # Add the generated images to the chat history for display on rerun
        # Storing raw bytes is better for serialization in session state
        st.session_state.messages.append({"role": "assistant", "content": [{"type": "image", "data": p.inline_data.data} for p in image_parts]})

# --- Sidebar ---
with st.sidebar:
    st.header("Controls")
    st.markdown("Your intelligent AI assistant for any query.")
    if st.button("Clear Chat History", use_container_width=True):
        st.session_state.messages = [
            {"role": "assistant", "content": "Hello! I am your AI assistant. How can I help you today?"}
        ]
        st.session_state.chat_session = model.start_chat(history=[])
        st.rerun()

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"], avatar="🧑‍💻" if message["role"] == "user" else "🤖"):
        content = message["content"]
        if isinstance(content, list):
            # Handle multi-part messages (like user uploads with text)
            for part in content:
                if isinstance(part, str):
                    st.markdown(part)
                elif isinstance(part, dict) and part.get("type") == "image":
                    st.image(io.BytesIO(part["data"]), width=200)
        else:
            st.markdown(content)

# --- Chat Input and Actions ---
col1, col2 = st.columns([0.85, 0.15])

with col1:
    uploaded_files = st.file_uploader(
        "Upload files",
        accept_multiple_files=True,
        type=["png", "jpg", "jpeg", "txt", "md", "py", "csv"],
        label_visibility="collapsed"
    )

with col2:
    if st.button("🎤", use_container_width=True, help="Speak to Assistant"):
        voice_prompt = get_voice_input()
        if voice_prompt:
            handle_prompt([voice_prompt])

if text_prompt := st.chat_input("Your message..."):
    prompt_parts = []
    # Process uploaded files first
    for file in uploaded_files:
        if file.type.startswith("image/"):
            img = Image.open(file)
            buffered = io.BytesIO()
            img.save(buffered, format=img.format or "PNG")
            # Store as a dict for consistent handling in the display loop
            prompt_parts.append({"type": "image", "data": buffered.getvalue()})
        else:
            # For text-based files
            try:
                file_content = file.getvalue().decode("utf-8")
                prompt_parts.append(f"Content of {file.name}:\n\n{file_content}\n")
            except Exception as e:
                st.error(f"Error reading file {file.name}: {e}")

    if text_prompt:
        prompt_parts.append(text_prompt)

    if prompt_parts:
        handle_prompt(prompt_parts)