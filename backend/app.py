import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})  # ✅ Allow all origins

    # ✅ Database Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'postgresql://lmsdb_os60_user:RwFH2FpXGvDN79yYM1be5vdoJQBovppd@dpg-cueshkdumphs73ajq8ng-a.oregon-postgres.render.com/lmsdb_os60')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ✅ JWT Configuration
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_secret_key")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))  # 1 hour

    # ✅ Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    Migrate(app, db)

    # Import models after initializing db to avoid circular imports
    from models import TokenBlocklist

    # Import blueprints after app is created
    from views.auth import auth_bp
    from views.user import user_bp
    from views.course import course_bp
    from views.enrollment import enrollment_bp

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

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
