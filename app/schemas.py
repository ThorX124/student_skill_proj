from pydantic import BaseModel
from typing import Optional

class StudentCreate(BaseModel):
    name: str
    email: str
    age: int
    
class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None

class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    age: int

class SkillCreate(BaseModel):
    name: str

class SkillUpdate(BaseModel):
    name: Optional[str] = None

class SkillResponse(BaseModel):
    id: int
    name: str

class StudentSkillCreate(BaseModel):
    student_id: int
    skill_id: int
    proficiency: int
    assessment_score: int

class StudentSkillUpdate(BaseModel):
    proficiency: Optional[int] = None
    assessment_score: Optional[int] = None

class StudentSkillResponse(BaseModel):
    id: int
    student_id: int
    skill_id: int
    proficiency: int
    assessment_score: int