from fastapi import APIRouter, HTTPException, status
from app.schemas import StudentResponse, StudentCreate, StudentUpdate
from app.services import StudentService, SkillService

router = APIRouter(tags=["Students"])

@router.post("/students", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate):
    if student.age < 15:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Student must be at least 15 years old")
    if not (student.email.endswith("@gmail.com") or student.email.endswith("@hotmail.com") or student.email.endswith("@outlook.com") or student.email.endswith("@apple.com")):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please enter a valid email address ending with @example.com")
    return StudentService.create_student(student.name, student.email, student.age)

@router.get("/students", response_model=list[StudentResponse])
def get_students():
    return StudentService.get_all_students()

@router.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int):
    student = StudentService.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student

@router.put("/students/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, student_update: StudentUpdate):
    student = StudentService.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return StudentService.update_student(student, student_update.name, student_update.email, student_update.age)

@router.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int):
    student = StudentService.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    StudentService.delete_student(student)

@router.post("/students/{student_id}/skills", response_model=StudentResponse)
def add_skill_to_student(student_id: int, skill_id: int, proficiency: int, assessment_score: int):
    student = StudentService.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    skill = SkillService.get_skill_by_id(skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    if proficiency < 1 or proficiency > 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Proficiency must be between 1 and 5")
    if assessment_score < 0 or assessment_score > 100:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assessment score must be between 0 and 100")
    return StudentService.add_skill_to_student(student, skill, proficiency, assessment_score)