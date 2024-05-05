from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_data():
    data = request.json 
    print(data)
    return jsonify(status="success", message="Data received")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
