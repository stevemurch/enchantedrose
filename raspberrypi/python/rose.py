# Raspberry Pi app -- install this on your RPi. 
# Uses GPIO pins to drive solenoids and potentially LED lighting

# ! TO RUN THE FLASK APP, YOU NEED TO DO THIS
# ! STEP 1: install libraries
# pip3 install flask 
# pip3 install flask_cors

# ! STEP 2: run the app to test it out
# python rose.py
# or py rose.py
# or python3 rose.py 
# ! STEP 2a: Manual test 
# You should be able to visit http://localhost:5001/status and see a status message 

# ! STEP 3: make sure this python flask app runs at every device boot 
# various strategies -- gunicorn, etc. 

# set that as a startup app 

from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
@cross_origin()
def home():
    return 'Hello world, from Raspberry Pi.'

@app.route('/status')
@cross_origin()
def status():
    return jsonify(message='Connection successful!')

@app.route('/activate/<solenoid>')
@cross_origin()
def drop(solenoid):
    if (not solenoid.isdigit()):
        return jsonify(message="Not numeric")
    sol_number = int(solenoid)
    if ((sol_number<1) or (sol_number>4)):
        return jsonify(message='Invalid number')
    return jsonify(message='Dropped '+solenoid)

if __name__=='__main__':
    app.run(host="0.0.0.0", port=5001)

