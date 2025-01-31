from flask import Blueprint, request, jsonify
from models import Enrollment, User, Course
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from flask_cors import cross_origin

enrollment_bp = Blueprint('enrollment', __name__)

def is_admin(user):
    """Check if a user has admin privileges."""
    return user.role == 'admin'


# ✅ Fetch all students currently enrolled in a course (Admins only)
@enrollment_bp.route('/enrolled-students', methods=['GET'])
@jwt_required()
def get_enrolled_students():
    """
    Fetch all students who are currently enrolled in a course.
    Admins only.
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not is_admin(current_user):
        return jsonify({"msg": "Admins only"}), 403

    enrollments = Enrollment.query.all()
    enrolled_students = [{
        "id": enrollment.student.id,
        "name": enrollment.student.name,
        "email": enrollment.student.email,
        "course_description": enrollment.course.description,  # ✅ Fixed from `title` to `description`
        "course_id": enrollment.course_id,
        "enrolled_on": enrollment.enrolled_on.isoformat()
    } for enrollment in enrollments]

    return jsonify(enrolled_students), 200


# ✅ Allow students to enroll in only **one** course at a time
@enrollment_bp.route('/enrollments', methods=['POST'])
@jwt_required()
def enroll_student():
    """
    Allows students to enroll in a course (only one at a time).
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != 'student':
        return jsonify({"msg": "Only students can enroll in courses!"}), 403

    data = request.get_json()
    student_id = data.get('student_id')
    course_id = data.get('course_id')

    if not student_id or not course_id:
        return jsonify({"msg": "Missing required fields: student_id, course_id"}), 400

    # Check if student is already enrolled
    existing_enrollment = Enrollment.query.filter_by(student_id=student_id).first()
    if existing_enrollment:
        return jsonify({"msg": "You must unenroll before enrolling in another course!"}), 409

    new_enrollment = Enrollment(student_id=student_id, course_id=course_id, enrolled_on=datetime.utcnow())

    try:
        db.session.add(new_enrollment)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Database error while enrolling"}), 500

    return jsonify({
        "msg": "Enrollment successful",
        "enrollment": {
            "student_id": new_enrollment.student_id,
            "course_id": new_enrollment.course_id,
            "enrolled_on": new_enrollment.enrolled_on.isoformat()
        }
    }), 201


# ✅ Allow students to unenroll from their current course
@enrollment_bp.route('/enrollments/my-enrollment', methods=['DELETE'])
@jwt_required()
def handle_unenrollment():
    """
    Allows a student to unenroll from their current course.
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != 'student':
        return jsonify({"msg": "Only students can unenroll!"}), 403

    enrollment = Enrollment.query.filter_by(student_id=current_user.id).first()

    if not enrollment:
        return jsonify({"msg": "You are not enrolled in any course"}), 404

    try:
        db.session.delete(enrollment)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Database error while unenrolling"}), 500

    return jsonify({"msg": "Successfully unenrolled"}), 200


# ✅ Allow admins or students to delete an enrollment
@enrollment_bp.route('/enrollments/<int:student_id>/<int:course_id>', methods=['DELETE'])
@jwt_required()
@cross_origin(origins="http://localhost:5173")
def delete_enrollment(student_id, course_id):
    """
    Allows an admin or a student to delete an enrollment.
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    enrollment = Enrollment.query.filter_by(student_id=student_id, course_id=course_id).first()

    if not enrollment:
        return jsonify({"msg": "Enrollment not found"}), 404

    if not is_admin(current_user) and current_user.id != student_id:
        return jsonify({"msg": "You are not authorized to remove this enrollment"}), 403

    try:
        db.session.delete(enrollment)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Database error occurred while deleting"}), 500

    return jsonify({"msg": "Enrollment deleted successfully"}), 200


# ✅ Fetch courses the logged-in student is enrolled in
@enrollment_bp.route('/enrollments/my-enrollments', methods=['GET'])
@jwt_required()
def my_enrollments():
    """
    Fetch all courses the logged-in student is enrolled in.
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != 'student':
        return jsonify({"msg": "Students only"}), 403

    enrollments = Enrollment.query.filter_by(student_id=current_user.id).all()
    enrollments_data = [{
        "course_id": enrollment.course_id,
        "course_description": enrollment.course.description,  # ✅ Fixed from `title` to `description`
        "enrolled_on": enrollment.enrolled_on.isoformat()
    } for enrollment in enrollments]

    return jsonify(enrollments_data), 200


# ✅ Fetch all enrollments (Admins only)
@enrollment_bp.route('/enrollments', methods=['GET'])
@jwt_required()
def fetch_all_enrollments():
    """
    Fetch all enrollments (Admins only).
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not is_admin(current_user):
        return jsonify({"msg": "Admins only"}), 403

    enrollments = Enrollment.query.all()
    enrollments_data = [{
        "student_id": enrollment.student_id,
        "student_name": enrollment.student.name,
        "course_id": enrollment.course_id,
        "course_description": enrollment.course.description,  # ✅ FIXED: Changed from `title` to `description`
        "enrolled_on": enrollment.enrolled_on.isoformat()
    } for enrollment in enrollments]

    return jsonify(enrollments_data), 200
