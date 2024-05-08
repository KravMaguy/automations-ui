from flask import Flask, json, request, jsonify

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_data():
    data = request.json 
    for item in data:
        print(item, ' item')
    return jsonify(status="success", message="Data received")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
