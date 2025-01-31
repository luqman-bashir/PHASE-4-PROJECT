from flask import Blueprint, request, jsonify
from models import User, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError

user_bp = Blueprint('user', __name__)

VALID_ROLES = {"student", "instructor", "admin"}

def is_admin(user):
    """Check if a user is an admin."""
    return user and user.role == "admin"

# ✅ GET ALL USERS (Admin Only)
@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = User.query.get(get_jwt_identity())

    if not is_admin(current_user):
        return jsonify({"msg": "Admins only"}), 403

    users = User.query.all()
    return jsonify([{
        "id": user.id, "username": user.username,
        "email": user.email, "role": user.role
    } for user in users]), 200

# ✅ GET USER BY ID (Admin or Self)
@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user = User.query.get(get_jwt_identity())

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if not is_admin(current_user) and current_user.id != user.id:
        return jsonify({"msg": "Access forbidden"}), 403

    return jsonify({
        "id": user.id, "username": user.username,
        "email": user.email, "role": user.role
    }), 200

# ✅ REGISTER USER
@user_bp.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    
    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student')  # Default to student

    if not all([name, username, email, password, role]):
        return jsonify({"msg": "Missing required fields: name, username, email, password, role"}), 400

    if role not in VALID_ROLES:
        return jsonify({"msg": "Invalid role. Must be 'admin', 'instructor', or 'student'."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already in use"}), 409
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already in use"}), 409

    hashed_password = generate_password_hash(password)

    try:
        new_user = User(
            name=name, username=username, email=email,
            password=hashed_password, role=role
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "User registered successfully."}), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"msg": "Database error", "error": str(e)}), 500



# ✅ UPDATE USER (Admin or Self)
@user_bp.route('/users/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    current_user = User.query.get(get_jwt_identity())

    # Ensure the current user exists
    if not current_user:
        return jsonify({"msg": "Invalid user token"}), 401

    user = User.query.get(user_id)
    
    # Check if user exists
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Ensure the user is an admin or updating their own profile
    if not is_admin(current_user) and current_user.id != user.id:
        return jsonify({"msg": "Access forbidden"}), 403

    data = request.get_json()

    # Validate and update fields if provided
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if username:
        if len(username) < 3:
            return jsonify({"msg": "Username must be at least 3 characters long"}), 400
        user.username = username

    if email:
        # Ensure email format is valid
        if "@" not in email or "." not in email:
            return jsonify({"msg": "Invalid email format"}), 400
        
        # Ensure email is unique
        existing_user = User.query.filter_by(email=email).filter(User.id != user_id).first()
        if existing_user:
            return jsonify({"msg": "Email already in use"}), 409
        
        user.email = email

    if password:
        if len(password) < 6:
            return jsonify({"msg": "Password must be at least 6 characters long"}), 400
        user.password = generate_password_hash(password, method="pbkdf2:sha256")

    try:
        db.session.commit()
        return jsonify({
            "msg": "User updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Database error occurred"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Unexpected error", "error": str(e)}), 500



# ✅ DELETE USER (Admin Only)
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user = User.query.get(get_jwt_identity())

    if not is_admin(current_user):
        return jsonify({"msg": "Admins only"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if current_user.id == user.id:
        return jsonify({"msg": "Admins cannot delete themselves"}), 403

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted successfully"}), 200