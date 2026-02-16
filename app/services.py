from app.models import Student, Skill, Student_skill
from app.database import students, skills, student_skills, get_next_student_id, get_next_skill_id, get_next_student_skill_id

class StudentService:
    def create_student(name: str, email: str, age: int) -> Student:
        student = Student(
            id=get_next_student_id(),
            name=name,
            email=email,
            age=age
        )
        students.append(student)
        return student

    def get_all_students() -> list[Student]:
        return students

    def get_student_by_id(student_id: int) -> Student | None:
        return next((s for s in students if s.id == student_id), None)

    def update_student(student: Student, name: str | None, email: str | None, age: int | None) -> Student:
        if name is not None:
            student.name = name
        if email is not None:
            student.email = email
        if age is not None:
            student.age = age
        return student

    def delete_student(student: Student) -> None:
        students.remove(student)

    def add_skill_to_student(student: Student, skill: Skill, proficiency: int, assessment_score: int) -> Student:
        student_skill = Student_skill(
            id=get_next_student_skill_id(),
            student_id=student.id,
            skill_id=skill.id,
            proficiency=proficiency,
            assessment_score=assessment_score
        )
        student_skills.append(student_skill)
        return student
    
class SkillService:
    def create_skill(name: str) -> Skill:
        skill = Skill(
            id=get_next_skill_id(),
            name=name
        )
        skills.append(skill)
        return skill

    def get_all_skills() -> list[Skill]:
        return skills

    def get_skill_by_id(skill_id: int) -> Skill | None:
        return next((s for s in skills if s.id == skill_id), None)

    def update_skill(skill: Skill, name: str | None) -> Skill:
        if name is not None:
            skill.name = name
        return skill

    def delete_skill(skill: Skill) -> None:
        skills.remove(skill)

class AnalyticsService:
    def create_student_skill(student_id: int, skill_id: int, proficiency: int, assessment_score: int) -> Student_skill:
        student_skill = Student_skill(
            id=get_next_student_skill_id(),
            student_id=student_id,
            skill_id=skill_id,
            proficiency=proficiency,
            assessment_score=assessment_score
        )
        student_skills.append(student_skill)
        return student_skill

    def get_all_student_skills() -> list[Student_skill]:
        return student_skills

    def get_student_skill_by_id(student_skill_id: int) -> Student_skill | None:
        return next((ss for ss in student_skills if ss.id == student_skill_id), None)

    def update_student_skill(student_skill: Student_skill, proficiency: int | None, assessment_score: int | None) -> Student_skill:
        if proficiency is not None:
            student_skill.proficiency = proficiency
        if assessment_score is not None:
            student_skill.assessment_score = assessment_score
        return student_skill

    def delete_student_skill(student_skill: Student_skill) -> None:
        student_skills.remove(student_skill)

    def get_average_proficiency_per_student() -> list[Student_skill]:
        student_proficiency = {}
        for ss in student_skills:
            if ss.student_id not in student_proficiency:
                student_proficiency[ss.student_id] = []
            student_proficiency[ss.student_id].append(ss.proficiency)
        
        average_proficiency = []
        for student_id, proficiencies in student_proficiency.items():
            avg_prof = sum(proficiencies) / len(proficiencies)
            average_proficiency.append(Student_skill(
                id=0,  # id is not relevant for average proficiency
                student_id=student_id,
                skill_id=0,  # skill_id is not relevant for average proficiency
                proficiency=int(avg_prof),
                assessment_score=0  # assessment_score is not relevant for average proficiency
            ))
        return average_proficiency
    
    def get_top_3_students_by_assessment_score() -> list[Student_skill]:
        sorted_skills = sorted(student_skills, key=lambda ss: ss.assessment_score, reverse=True)
        return sorted_skills[:3]