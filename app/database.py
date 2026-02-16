from app.models import student, skill, student_skill

students: list[student] = []
skills: list[skill] = []
student_skills: list[student_skill] = []

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
