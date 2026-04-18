from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.students import router as students_router
from app.api.v1.activities import router as activities_router
from app.api.v1.help_posts import help_router, posts_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(students_router)
api_router.include_router(activities_router)
api_router.include_router(help_router)
api_router.include_router(posts_router)
