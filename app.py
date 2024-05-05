from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_data():
    data = request.json  # Get JSON data sent from the extension
    # Process your data or store it here
    print(data)  # Just printing the data for demonstration
    
    # You can handle file creation and downloading here or send data back
    return jsonify(status="success", message="Data received")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
