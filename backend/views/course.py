from flask import Blueprint, request, jsonify
from models import Course, User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

course_bp = Blueprint('course', __name__)

def is_admin(user):
    """Helper function to check if a user has admin privileges."""
    return user.role == 'admin'

@course_bp.route('/courses', methods=['GET'])
@jwt_required()
def list_courses():
    """
    List all courses in the system.
    Accessible by all authenticated users.
    """
    courses = Course.query.all()
    courses_data = [{
        "id": course.id,
        "description": course.description,
        "instructor_id": course.instructor_id,
        "instructor_name": course.instructor.name if course.instructor else "Unknown",
        "created_at": course.created_at.isoformat(),
        "updated_at": course.updated_at.isoformat()
    } for course in courses]

    return jsonify(courses_data), 200

@course_bp.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    """Create a new course (Admins only)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not is_admin(current_user):
        return jsonify({"msg": "Admins only"}), 403

    data = request.get_json()
    description = data.get('description')
    instructor_id = data.get('instructor_id')

    if not description or not instructor_id:
        return jsonify({"msg": "Missing required fields"}), 400

    instructor = User.query.get(instructor_id)
    if not instructor or instructor.role != 'instructor':
        return jsonify({"msg": "Invalid instructor_id"}), 400

    new_course = Course(description=description, instructor_id=instructor_id)

    try:
        db.session.add(new_course)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Database error occurred while creating the course"}), 500

    return jsonify({
        "msg": "Course created successfully",
        "course": {
            "id": new_course.id,
            "description": new_course.description,
            "instructor_id": new_course.instructor_id,
            "instructor_name": instructor.name
        }
    }), 201

@course_bp.route('/courses/<int:course_id>', methods=['GET'])
@jwt_required()
def get_course(course_id):
    """Get details of a specific course. Accessible by all authenticated users."""
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"msg": "Course not found"}), 404

    course_data = {
        "id": course.id,
        "description": course.description,
        "instructor_id": course.instructor_id,
        "instructor_name": course.instructor.name if course.instructor else "Unknown",
        "created_at": course.created_at.isoformat(),
        "updated_at": course.updated_at.isoformat()
    }
    return jsonify(course_data), 200

@course_bp.route('/courses/<int:course_id>', methods=['PATCH'])
@jwt_required()
def update_course(course_id):
    """Update a course (Admins only)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not is_admin(current_user):
        return jsonify({"msg": "Admins only"}), 403

    course = Course.query.get(course_id)
    if not course:
        return jsonify({"msg": "Course not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Invalid JSON format or missing Content-Type"}), 400

    description = data.get('description')
    instructor_id = data.get('instructor_id')

    if description:
        course.description = description
    
    if instructor_id:
        instructor = User.query.get(instructor_id)
        if not instructor or instructor.role != 'instructor':
            return jsonify({"msg": "Invalid instructor_id"}), 400
        course.instructor_id = instructor_id

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Database error occurred while updating the course"}), 500

    return jsonify({"msg": "Course updated successfully"}), 200

@course_bp.route('/courses/<int:course_id>', methods=['DELETE'])
@jwt_required()
def delete_course(course_id):
    """Delete a specific course. Admins only."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not is_admin(current_user):
        return jsonify({"msg": "Admins only"}), 403

    course = Course.query.get(course_id)
    if not course:
        return jsonify({"msg": "Course not found"}), 404

    try:
        db.session.delete(course)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Database error occurred while deleting the course"}), 500

    return jsonify({"msg": "Course deleted successfully"}), 200

@course_bp.route('/courses/my-courses', methods=['GET'])
@jwt_required()
def my_courses():
    """List all courses taught by the logged-in instructor."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != 'instructor':
        return jsonify({"msg": "Instructors only"}), 403

    courses = Course.query.filter_by(instructor_id=current_user.id).all()
    courses_data = [{
        "id": course.id,
        "description": course.description,
        "created_at": course.created_at.isoformat(),
        "updated_at": course.updated_at.isoformat()
    } for course in courses]

    return jsonify(courses_data), 200