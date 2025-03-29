from flask import Blueprint, jsonify

base = Blueprint('base', __name__)

@base.route('/', methods=['GET'])
def home():
    return jsonify({"message": "backend ready"})


