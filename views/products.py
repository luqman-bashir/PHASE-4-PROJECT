from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Product

product_bp = Blueprint("product_bp", __name__)

# Retrieve all products
@product_bp.route("/products", methods=["GET"])
def fetch_products():
    products = Product.query.all()
    product_list = [
        {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'user_id': product.user_id
        } for product in products
    ]
    return jsonify(product_list), 200

# Retrieve a single product
@product_bp.route("/products/<int:product_id>", methods=["GET"])
def fetch_product(product_id):
    product = Product.query.get(product_id)
    if product:
        product_data = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'user_id': product.user_id
        }
        return jsonify(product_data), 200
    return jsonify({"error": "Product not found"}), 404

# Add a new product
@product_bp.route("/products", methods=["POST"])
def add_product():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    user_id = data.get('user_id')

    # Validate input
    if not name or not description or not isinstance(price, (int, float)) or not user_id:
        return jsonify({"error": "Invalid input. All fields are required."}), 400

    # Create and save the new product
    new_product = Product(name=name, description=description, price=price, user_id=user_id)
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"success": "Product added successfully"}), 201

# Update a product
@product_bp.route("/products/<int:product_id>", methods=["PATCH"])
def update_product(product_id):
    user_id = get_jwt_identity()  
    product = Product.query.get(product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    if product.user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403
            
    data = request.get_json()
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)

    db.session.commit()
    return jsonify({"success": "Product updated successfully"}), 200


# Delete a product
@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    user_id = get_jwt_identity() 
    product = Product.query.get(product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    if product.user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    db.session.delete(product)
    db.session.commit()
    return jsonify({"success": "Product deleted successfully"}), 200
