from fastapi import APIRouter, HTTPException, status
from app.schemas import StudentSkillCreate, StudentSkillResponse
from app.services import AnalyticsService

router = APIRouter(tags=["Student Skills"])

@router.post("/student-skills", response_model=StudentSkillResponse, status_code=status.HTTP_201_CREATED)
def create_student_skill(student_skill: StudentSkillCreate):
    return AnalyticsService.create_student_skill(student_skill.student_id, student_skill.skill_id, student_skill.proficiency, student_skill.assessment_score)

@router.get("/student-skills", response_model=list[StudentSkillResponse])
def get_all_student_skills():
    return AnalyticsService.get_all_student_skills()

@router.get("/student-skills/{student_skill_id}", response_model=StudentSkillResponse)
def get_student_skill(student_skill_id: int):
    student_skill = AnalyticsService.get_student_skill_by_id(student_skill_id)
    if not student_skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student skill not found")
    return student_skill

@router.put("/student-skills/{student_skill_id}", response_model=StudentSkillResponse)
def update_student_skill(student_skill_id: int, student_skill_update: StudentSkillCreate):
    student_skill = AnalyticsService.get_student_skill_by_id(student_skill_id)
    if not student_skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student skill not found")
    return AnalyticsService.update_student_skill(student_skill, student_skill_update.student_id, student_skill_update.skill_id, student_skill_update.proficiency, student_skill_update.assessment_score)

@router.delete("/student-skills/{student_skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student_skill(student_skill_id: int):
    student_skill = AnalyticsService.get_student_skill_by_id(student_skill_id)
    if not student_skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student skill not found")
    AnalyticsService.delete_student_skill(student_skill)

@router.get('/student-skills/students/average-proficiency', response_model=list[StudentSkillResponse])
def get_average_proficiency_per_student():
    return AnalyticsService.get_average_proficiency_per_student()

@router.get('/student-skills/top-students', response_model=list[StudentSkillResponse])
def get_top_students_by_assessment_score():
    return AnalyticsService.get_top_3_students_by_assessment_score()