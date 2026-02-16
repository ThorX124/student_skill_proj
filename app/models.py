class Student:
    def __init__(self, id: int, name: str, email: str, age: int):
        self.id = id
        self.name = name
        self.email = email
        self.age = age

class Skill:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name

class Student_skill:
    def __init__(self, student_id: int, skill_id: int, proficiency: int, assessment_score: int):
        self.student_id = student_id
        self.skill_id = skill_id
        self.proficiency = proficiency
        self.assessment_score = assessment_score