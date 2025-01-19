from flask import jsonify, request, Blueprint
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
            'price': product.price
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
            'price': product.price
        }
        return jsonify(product_data), 200
    return jsonify({"error": "Product not found"}), 404

# Add a new product
@product_bp.route("/products", methods=["POST"])
def add_product():
    data = request.get_json()
    name = data['name']
    description = data['description']
    price = data['price']

    # Validate input
    if not name or not description or not isinstance(price, (int, float)):
        return jsonify({"error": "Invalid input"}), 400

    # Create and save new product
    new_product = Product(name=name, description=description, price=price)
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"success": "Product added successfully"}), 201

# Update a product
@product_bp.route("/products/<int:product_id>", methods=["PATCH"])
def update_product(product_id):
    product = Product.query.get(product_id)
    if product:
        data = request.get_json()
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = data.get('price', product.price)

        db.session.commit()
        return jsonify({"success": "Product updated successfully"}), 200

    return jsonify({"error": "Product not found"}), 404

# Delete a product
@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if product:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"success": "Product deleted successfully"}), 200

    return jsonify({"error": "Product not found"}), 404
