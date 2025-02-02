from flask import jsonify, request, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity, get_jwt
)

auth_bp = Blueprint("auth_bp", __name__)

# ✅ LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and return JWT token."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return jsonify({"error": "Email, password, and role are required"}), 400

    role = role.lower()  # ✅ Normalize role
    user = User.query.filter_by(email=email, role=role).first()

    if not user:
        return jsonify({"error": "No user found with this email and role"}), 401
    if not check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password"}), 401

    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=1))

    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "username": user.username,
            "role": user.role,
            "is_admin": user.role == "admin"
        }
    }), 200


# ✅ GET CURRENT USER
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    """Get details of the logged-in user."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "username": user.username,
        "role": user.role,
        "is_admin": user.role == "admin"
    }), 200


# Logout
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(token_blocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success":"Logged out successfully"})


# ✅ REGISTER USER (Ensure "name" is Included)
@auth_bp.route("/users", methods=["POST"])
def register_user():
    """Registers a new user."""
    data = request.get_json()
    print("Received Registration Data:", data)  # ✅ Debugging Print

    # ✅ Validate all required fields
    required_fields = ["name", "username", "email", "password", "role"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    name = data["name"].strip()  # ✅ Ensure name is processed
    username = data["username"].strip()
    email = data["email"].strip().lower()
    password = data["password"]
    role = data["role"].strip().lower()

    # ✅ Validate role
    if role not in ["student", "instructor", "admin"]:
        return jsonify({"error": "Invalid role. Must be 'admin', 'instructor', or 'student'."}), 400

    # ✅ Check for existing user
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already in use"}), 409
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already in use"}), 409

    # ✅ Hash password and create user
    hashed_password = generate_password_hash(password)

    new_user = User(
        name=name,  # ✅ Ensure name is saved
        username=username,
        email=email,
        password=hashed_password,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "msg": "User registered successfully.",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }
    }), 201