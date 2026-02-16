from app.models import student, skill, student_skill
from app.database import students, skills, student_skills, get_next_student_id, get_next_skill_id, get_next_student_skill_id

class StudentService:
    def create_student(name: str, email: str, age: int) -> student:
        student = student(
            id=get_next_student_id(),
            name=name,
            email=email,
            age=age
        )
        students.append(student)
        return student

    def get_all_students() -> list[student]:
        return students

    def get_student_by_id(student_id: int) -> student | None:
        return next((s for s in students if s.id == student_id), None)

    def update_student(student: student, name: str | None, email: str | None, age: int | None) -> student:
        if name is not None:
            student.name = name
        if email is not None:
            student.email = email
        if age is not None:
            student.age = age
        return student

    def delete_student(student: student) -> None:
        students.remove(student)

    def add_skill_to_student(student: student, skill: skill, proficiency: int, assessment_score: int) -> student:
        student_skill = student_skill(
            student_id=student.id,
            skill_id=skill.id,
            proficiency=proficiency,
            assessment_score=assessment_score
        )
        student_skills.append(student_skill)
        return student
    
class SkillService:
    def create_skill(name: str) -> skill:
        skill = skill(
            id=get_next_skill_id(),
            name=name
        )
        skills.append(skill)
        return skill

    def get_all_skills() -> list[skill]:
        return skills

    def get_skill_by_id(skill_id: int) -> skill | None:
        return next((s for s in skills if s.id == skill_id), None)

    def update_skill(skill: skill, name: str | None) -> skill:
        if name is not None:
            skill.name = name
        return skill

    def delete_skill(skill: skill) -> None:
        skills.remove(skill)

class AnalyticsService:
    def create_student_skill(student_id: int, skill_id: int, proficiency: int, assessment_score: int) -> student_skill:
        student_skill = student_skill(
            student_skill_id=get_next_student_skill_id(),
            student_id=student_id,
            skill_id=skill_id,
            proficiency=proficiency,
            assessment_score=assessment_score
        )
        student_skills.append(student_skill)
        return student_skill

    def get_all_student_skills() -> list[student_skill]:
        return student_skills

    def get_student_skill_by_id(student_id: int, skill_id: int) -> student_skill | None:
        return next((ss for ss in student_skills if ss.student_id == student_id and ss.skill_id == skill_id), None)

    def update_student_skill(student_skill: student_skill, proficiency: int | None, assessment_score: int | None) -> student_skill:
        if proficiency is not None:
            student_skill.proficiency = proficiency
        if assessment_score is not None:
            student_skill.assessment_score = assessment_score
        return student_skill

    def delete_student_skill(student_skill: student_skill) -> None:
        student_skills.remove(student_skill)

    def get_average_proficiency_per_student() -> list[student_skill]:
        student_proficiency = {}
        for ss in student_skills:
            if ss.student_id not in student_proficiency:
                student_proficiency[ss.student_id] = []
            student_proficiency[ss.student_id].append(ss.proficiency)
        
        average_proficiency = []
        for student_id, proficiencies in student_proficiency.items():
            avg_prof = sum(proficiencies) / len(proficiencies)
            average_proficiency.append(student_skill(
                student_id=student_id,
                skill_id=0,  # skill_id is not relevant for average proficiency
                proficiency=int(avg_prof),
                assessment_score=0  # assessment_score is not relevant for average proficiency
            ))
        return average_proficiency
    
    def get_top_3_students_by_assessment_score() -> list[student_skill]:
        sorted_skills = sorted(student_skills, key=lambda ss: ss.assessment_score, reverse=True)
        return sorted_skills[:3]