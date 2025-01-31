import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

# Import models and blueprints
from models import db, TokenBlocklist
from views.auth import auth_bp
from views.user import user_bp
from views.course import course_bp
from views.enrollment import enrollment_bp

# Initialize Flask App
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # ✅ Allow all origins

# ✅ Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'postgresql://learning_managemaent_system_ub40_user:gZac2RyfrHwzh7YjI28TWmsTSwwzLzNt@dpg-cueff6lsvqrc73dajov0-a.oregon-postgres.render.com/learning_managemaent_system_ub40')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ✅ JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_secret_key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))  # 1 hour

# ✅ Initialize Extensions
db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

# ✅ Register Blueprints
app.register_blueprint(user_bp)
app.register_blueprint(enrollment_bp)
app.register_blueprint(course_bp)
app.register_blueprint(auth_bp)

# ✅ JWT Token Blocklist Check
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None  # True if token is revoked

# ✅ Handle Expired Token
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired. Please log in again."}), 401

# ✅ Handle Invalid Token
@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"error": "Invalid token. Please log in again."}), 401

# ✅ Handle Missing Token
@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({"error": "Missing Authorization Header"}), 401

# ✅ Run App
if __name__ == "__main__":
    app.run(debug=True)
