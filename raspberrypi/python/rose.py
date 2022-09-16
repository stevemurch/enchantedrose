# Raspberry Pi app -- install this on your RPi. 
# Uses GPIO pins to drive solenoids and potentially LED lighting

# To run the Flask app, you need to set an environment variable

# ! TO RUN THE FLASK APP, YOU NEED TO DO THIS
# export FLASK_APP=rose.py
# flask run --host=0.0.0.0 --port=5001

# set that as a startup app 

from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
@cross_origin()
def hello():
    return 'Hello, World!'

@app.route('/activate/<solenoid>')
@cross_origin()
def drop(solenoid):
    if (not solenoid.isdigit()):
        return jsonify(message="Not numeric")
    sol_number = int(solenoid)
    if ((sol_number<1) or (sol_number>4)):
        return jsonify(message='Invalid number')
    return jsonify(message='Dropped '+solenoid)

