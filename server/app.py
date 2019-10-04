from flask import Flask
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/save_map')
def hello_world():
    return 'OK'

if __name__ == '__main__':
    app.run()
