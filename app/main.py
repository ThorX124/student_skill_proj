from fastapi import FastAPI
from app.routes.students import router as students_router
from app.routes.skills import router as skills_router
from app.routes.analytics import router as analytics_router

app = FastAPI(
    title="Student Skill Tracking and Analysis API",
    description="API for tracking and analyzing student skills in various subjects.",
    version="1.0.0",
)

app.include_router(students_router, prefix="/students")
app.include_router(skills_router, prefix="/skills")
app.include_router(analytics_router, prefix="/analytics")