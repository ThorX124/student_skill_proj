from app.models import Student, Skill, Student_skill

students: list[Student] = []
skills: list[Skill] = []
student_skills: list[Student_skill] = []

_current_student_id = 0
_current_skill_id = 0
_current_student_skill_id = 0

def get_next_student_id() -> int:
    global _current_student_id
    _current_student_id += 1
    return _current_student_id

def get_next_skill_id() -> int:
    global _current_skill_id
    _current_skill_id += 1
    return _current_skill_id

def get_next_student_skill_id() -> int:
    global _current_student_skill_id
    _current_student_skill_id += 1
    return _current_student_skill_id
