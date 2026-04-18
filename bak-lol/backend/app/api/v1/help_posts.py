from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from uuid import UUID
from typing import Optional

from app.core.database import get_db
from app.models.help import HelpRequest, HelpResponse
from app.models.post import Post
from app.schemas.help import (
    HelpRequestCreate, HelpRequestOut,
    HelpResponseCreate, HelpResponseOut,
    PostCreate, PostOut,
)
from app.api.deps import get_current_student
from app.models.student import Student

help_router = APIRouter(prefix="/help", tags=["help"])
posts_router = APIRouter(prefix="/posts", tags=["posts"])


def _help_out(req: HelpRequest) -> dict:
    d = HelpRequestOut.model_validate(req).model_dump()
    d["response_count"] = len(req.responses)
    return d


# ── Help Requests ──────────────────────────────────────────────

@help_router.get("/", response_model=list[HelpRequestOut])
def list_help(
    category: Optional[str] = None,
    is_resolved: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
    _: Student = Depends(get_current_student),
):
    q = db.query(HelpRequest).options(joinedload(HelpRequest.poster), joinedload(HelpRequest.responses))
    if category:
        q = q.filter(HelpRequest.category == category)
    if is_resolved is not None:
        q = q.filter(HelpRequest.is_resolved == is_resolved)
    reqs = q.order_by(HelpRequest.created_at.desc()).offset(skip).limit(limit).all()
    return [_help_out(r) for r in reqs]


@help_router.post("/", response_model=HelpRequestOut, status_code=status.HTTP_201_CREATED)
def create_help(
    payload: HelpRequestCreate,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    req = HelpRequest(**payload.model_dump(), poster_id=current.id)
    db.add(req)
    db.commit()
    db.refresh(req)
    return _help_out(req)


@help_router.get("/{req_id}", response_model=HelpRequestOut)
def get_help(
    req_id: UUID,
    db: Session = Depends(get_db),
    _: Student = Depends(get_current_student),
):
    req = db.query(HelpRequest).options(
        joinedload(HelpRequest.poster), joinedload(HelpRequest.responses).joinedload(HelpResponse.responder)
    ).filter(HelpRequest.id == req_id).first()
    if not req:
        raise HTTPException(404, "Not found")
    return _help_out(req)


@help_router.post("/{req_id}/respond", response_model=HelpResponseOut, status_code=status.HTTP_201_CREATED)
def respond(
    req_id: UUID,
    payload: HelpResponseCreate,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    req = db.query(HelpRequest).filter(HelpRequest.id == req_id).first()
    if not req:
        raise HTTPException(404, "Not found")
    if req.is_resolved:
        raise HTTPException(400, "Request already resolved")
    resp = HelpResponse(request_id=req_id, responder_id=current.id, content=payload.content)
    db.add(resp)
    db.commit()
    db.refresh(resp)
    return resp


@help_router.patch("/{req_id}/resolve", status_code=status.HTTP_204_NO_CONTENT)
def resolve_help(
    req_id: UUID,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    req = db.query(HelpRequest).filter(HelpRequest.id == req_id).first()
    if not req:
        raise HTTPException(404, "Not found")
    if req.poster_id != current.id:
        raise HTTPException(403, "Only the poster can resolve this")
    req.is_resolved = True
    db.commit()


# ── Posts ──────────────────────────────────────────────────────

@posts_router.get("/", response_model=list[PostOut])
def list_posts(
    tag: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
    _: Student = Depends(get_current_student),
):
    q = db.query(Post).options(joinedload(Post.author))
    if tag:
        q = q.filter(Post.tag == tag)
    return q.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()


@posts_router.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
def create_post(
    payload: PostCreate,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    post = Post(**payload.model_dump(), author_id=current.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post
