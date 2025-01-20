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
@user_bp.route("/users/<int:user_id>", methods=["PATCH"])
def update_users(user_id):
    # Check for proper Content-Type
    if not request.is_json:
        return jsonify({"error": "Unsupported Media Type. Use 'application/json'"}), 415

    # Fetch the user from the database
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Parse the JSON payload
    data = request.get_json()
    username = data.get('username', user.username)
    email = data.get('email', user.email)
    password = data.get('password', None)

    # Check for existing username and email
    check_username = User.query.filter(User.username == username, User.id != user.id).first()
    check_email = User.query.filter(User.email == email, User.id != user.id).first()

    if check_username or check_email:
        return jsonify({"error": "Username or email already exists"}), 409

    # Update user details
    user.username = username
    user.email = email
    if password:
        user.password = hash_password(password)  # Hash the password before storing it

    db.session.commit()
    return jsonify({"success": "Updated successfully"}), 200


@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_users(user_id):
    # Fetch the user from the database
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check if the user has associated products
    if user.products:  
        return jsonify({"error": "Cannot delete user with associated products"}), 400

    # Delete the user
    db.session.delete(user)
    db.session.commit()
    return jsonify({"success": "User deleted successfully"}), 200
