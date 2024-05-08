from flask import Flask, json, request, jsonify

app = Flask(__name__)


@app.route('/upload', methods=['POST'])
def upload_data():
    data = request.json
    formFieldData = {}
    for item in data:
        field_name, value = item[0], item[1]
        if field_name not in formFieldData or formFieldData[field_name] != value:
            formFieldData[field_name] = value

    print(formFieldData)

    return jsonify(status="success", message="Data received")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
