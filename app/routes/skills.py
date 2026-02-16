from fastapi import APIRouter, HTTPException, status
from app.schemas import SkillCreate, SkillResponse, SkillUpdate
from app.services import SkillService

router = APIRouter(tags=["Skills"])

@router.post("/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(skill: SkillCreate):
    return SkillService.create_skill(skill.name)

@router.get("/skills", response_model=list[SkillResponse])
def get_skills():
    return SkillService.get_all_skills()

@router.get("/skills/{skill_id}", response_model=SkillResponse)
def get_skill(skill_id: int):
    skill = SkillService.get_skill_by_id(skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    return skill

@router.put("/skills/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, skill_update: SkillUpdate):
    skill = SkillService.get_skill_by_id(skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    return SkillService.update_skill(skill, skill_update.name)

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(skill_id: int):
    skill = SkillService.get_skill_by_id(skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    SkillService.delete_skill(skill)