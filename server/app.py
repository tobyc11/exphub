from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
import time
import threading

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')

stream_thread = None
stop_threads = False
g_count = 0

@app.route('/')
def blank_page():
    return 'This is a blank page. Please use the APIs.'

@app.route('/api/status')
def api_status():
    d = {}
    d['status'] = 'ok'
    return jsonify(d)

@app.route('/api/connect')
def api_connect():
    d = {}
    d['message'] = 'Successfully connected.'
    return jsonify(d)

@app.route('/api/disconnect')
def api_disconnect():
    d = {}
    d['return'] = -1
    d['message'] = 'Intel RealSense API erred.'
    return jsonify(d), 500

@app.route('/api/save_states')
def api_save_states():
    d = {}
    d['message'] = 'Succeess.'
    return jsonify(d)

@app.route('/api/load_states')
def api_load_states():
    d = {}
    d['message'] = 'Succeess.'
    return jsonify(d)

def streaming_worker():
    while not stop_threads:
        socketio.emit('tick', {'x': 1, 'y': 1, 'z': 1})
        for i in range(10):
            time.sleep(1)
            global g_count
            g_count += 1
            socketio.emit('tick', {'x': i, 'y': g_count, 'z': 2})

@app.route('/api/start_streaming')
def api_start_streaming():
    global stream_thread, stop_threads
    d = {}
    if stream_thread:
        d['return'] = -1
        d['message'] = 'Streaming is already running.'
        return jsonify(d)
    stop_threads = False
    stream_thread = threading.Thread(target=streaming_worker)
    stream_thread.start()
    d['return'] = 0
    return jsonify(d)

@app.route('/api/stop_streaming')
def api_stop_streaming():
    global stream_thread, stop_threads
    d = {}
    if stream_thread:
        d['return'] = 0
        stop_threads = True
        stream_thread = None
        return jsonify(d)
    d['return'] = -1
    return jsonify(d)

@app.route('/api/set_static_node')
def api_set_static_node():
    d = {}
    d['return'] = 0
    d['message'] = 'Succeess.'
    return jsonify(d)

@app.route('/api/get_static_node')
def api_get_static_node():
    d = {}
    d['message'] = 'Succeess.'
    return jsonify(d)

if __name__ == '__main__':
    socketio.run(app)
