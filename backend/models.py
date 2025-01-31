from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Enum, CheckConstraint
from datetime import datetime

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(512),  nullable=False)
    
    # ✅ Fix: role now determines admin status
    role = db.Column(Enum('student', 'instructor', 'admin', name='user_roles'), nullable=False)

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<User {self.username}, Role: {self.role}, Approved: {self.is_approved}, Active: {self.is_active}>"



    # Relationships
    enrollments = db.relationship('Enrollment', back_populates='student', cascade="all, delete-orphan")
    courses_taught = db.relationship('Course', backref='instructor', lazy=True, foreign_keys='Course.instructor_id')

    def __repr__(self):
        return f"<User {self.email}, Role: {self.role}>"

class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=True)
    instructor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    enrollments = db.relationship('Enrollment', back_populates='course', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Course {self.title}, Instructor ID: {self.instructor_id}>"

class Enrollment(db.Model):
    __tablename__ = 'enrollment'
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
    enrolled_on = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    student = db.relationship('User', back_populates='enrollments')
    course = db.relationship('Course', back_populates='enrollments')

    def __repr__(self):
        return f"<Enrollment Student ID: {self.student_id}, Course ID: {self.course_id}>"

class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'  # ✅ Ensure table name is correct
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)

