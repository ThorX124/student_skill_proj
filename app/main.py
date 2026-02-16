from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routes.students import router as students_router
from app.routes.skills import router as skills_router
from app.routes.analytics import router as analytics_router

app = FastAPI(
    title="Student Skill Tracking and Analysis API",
    description="API for tracking and analyzing student skills in various subjects.",
    version="1.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(students_router, prefix="/students")
app.include_router(skills_router, prefix="/skills")
app.include_router(analytics_router, prefix="/analytics")

# Serve static files (must be last to not override API routes)
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")