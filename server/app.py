from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
import time
import threading
import sys


sys.path.append('/home/toby/Dev/librealsense/build/wrappers/python')
import pyrealsense2 as rs


app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')

#------Context for camera------
pipe = rs.pipeline()
cfg = rs.config()
profile = None

localization_map = []

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
    global profile
    d = {}
    try:
        profile = pipe.start(cfg)
        pipe.stop()
    except RuntimeError as e:
        d['return'] = -1
        d['message'] = str(e)
        d['bIsOn'] = False
        return jsonify(d)
    d['return'] = 0
    d['message'] = 'Successfully connected.'
    d['bIsOn'] = True
    return jsonify(d)

@app.route('/api/disconnect')
def api_disconnect():
    global profile
    d = {}
    try:
        profile = None
    except RuntimeError as e:
        d['return'] = -1
        d['message'] = str(e)
        d['bIsOn'] = False
    d['return'] = 0
    d['message'] = 'Successfully stopped camera.'
    d['bIsOn'] = False
    return jsonify(d)

@app.route('/api/save_states')
def api_save_states():
    global localization_map
    d = {}
    try:
        dev = profile.get_device()
        pose_sensor = dev.first_pose_sensor()
        localization_map = pose_sensor.export_localization_map()
    except RuntimeError as e:
        d['return'] = -1
        d['message'] = repr(e)
        return jsonify(d)
    d['return'] = -100
    d['message'] = 'len(localization_map)=' + str(len(localization_map))
    return jsonify(d)

@app.route('/api/load_states')
def api_load_states():
    global localization_map
    d = {}
    if not localization_map:
        d['return'] = -1
        d['message'] = 'localization_map is empty'
        return jsonify(d)
    try:
        dev = profile.get_device()
        pose_sensor = dev.first_pose_sensor()
        success = pose_sensor.import_localization_map(localization_map)
    except RuntimeError as e:
        d['return'] = -1
        d['message'] = repr(e)
        return jsonify(d)
    d['return'] = 0 if success else -1
    d['message'] = str(success)
    return jsonify(d)

def streaming_worker():
    global pipe, cfg, profile
    while not stop_threads:
        frames = pipe.wait_for_frames()
        pose_frame = frames.get_pose_frame()
        pose = pose_frame.get_pose_data()
        #data_point = [pose.translation, pose.velocity, pose.acceleration, pose.rotation,
        #            pose.tracker_confidence, pose.mapper_confidence]
        socketio.emit('tick', {'x': pose.translation.x, 'y': pose.translation.y, 'z': pose.translation.z})
    pipe.stop()

@app.route('/api/start_streaming')
def api_start_streaming():
    global stream_thread, stop_threads, pipe
    d = {}
    if stream_thread:
        d['return'] = -1
        d['message'] = 'Streaming is already running.'
        return jsonify(d)
    pipe.start()
    stop_threads = False
    stream_thread = threading.Thread(target=streaming_worker)
    stream_thread.start()
    d['return'] = 0
    d['bIsStreaming'] = True
    return jsonify(d)

@app.route('/api/stop_streaming')
def api_stop_streaming():
    global stream_thread, stop_threads
    d = {}
    if stream_thread:
        d['return'] = 0
        d['bIsStreaming'] = False
        stop_threads = True
        stream_thread = None
        return jsonify(d)
    d['return'] = -1
    d['dIsStreaming'] = False
    d['message'] = 'Not streaming'
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
