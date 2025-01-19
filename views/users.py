from flask import jsonify, request, Blueprint
from models import db, User
from werkzeug.security import generate_password_hash

user_bp = Blueprint("user_bp", __name__)

## Retrieve all users
@user_bp.route("/users", methods=["GET"])
def fetch_users():
    users = User.query.all()
    user_list = [
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        } for user in users
    ]
    return jsonify(user_list), 200

# Retrieve a single user
@user_bp.route("/users/<int:user_id>", methods=["GET"])
def fetch_user(user_id):
    user = User.query.get(user_id)
    if user:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
        return jsonify(user_data), 200
    return jsonify({"error": "User not found"}), 404

# Add a new user
@user_bp.route("/users", methods=["POST"])
def add_user():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = generate_password_hash(data['password'])

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already exists"}), 400
    else:
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"success": "User added successfully"}), 201

# Update a user
@user_bp.route("/users/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get(user_id)
    if user:
        data = request.get_json()
        username = data.get('username', user.username)
        email = data.get('email', user.email)
        password = data.get('password')

        if User.query.filter((User.username == username) & (User.id != user.id)).first():
            return jsonify({"error": "Username already exists"}), 400
        if User.query.filter((User.email == email) & (User.id != user.id)).first():
            return jsonify({"error": "Email already exists"}), 400

        # Update fields
        user.username = username
        user.email = email
        if password:  # Hash new password if provided
            user.password = generate_password_hash(password)

        db.session.commit()
        return jsonify({"success": "User updated successfully"}), 200

    return jsonify({"error": "User does not exist"}), 404

# Delete a user
@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": "User deleted successfully"}), 200

    return jsonify({"error": "User does not exist"}), 404
