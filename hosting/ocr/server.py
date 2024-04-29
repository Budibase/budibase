import easyocr
from flask import Flask, jsonify, request

app = Flask(__name__)
reader = easyocr.Reader(["en"])


@app.route("/ocr", methods=["POST"])
def ocr():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if file:
        image_path = file.read()
        result = reader.readtext(image_path)
        return jsonify({"text": " ".join([r[1] for r in result])}), 200


if __name__ == "__main__":
    app.run("0.0.0.0", "8080")
