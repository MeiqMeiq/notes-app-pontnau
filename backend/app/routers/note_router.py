from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas import note_schema
from ..repositories import note_repository
from ..database import get_db

router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)

@router.post("/", response_model=note_schema.Note, status_code=status.HTTP_201_CREATED)
def create_note_endpoint(note: note_schema.NoteCreate, db: Session = Depends(get_db)):
    return note_repository.create_note(db=db, note=note)

@router.get("/", response_model=List[note_schema.Note])
def read_active_notes(
    skip: int = 0, 
    limit: int = 100, 
    tag: Optional[str] = Query(None, description="Filtrar por nombre de tag"),
    db: Session = Depends(get_db)
):
    return note_repository.get_active_notes(db=db, skip=skip, limit=limit, tag_name=tag)

@router.get("/archived", response_model=List[note_schema.Note])
def read_archived_notes(
    skip: int = 0, 
    limit: int = 100, 
    tag: Optional[str] = Query(None, description="Filtrar por nombre de tag"),
    db: Session = Depends(get_db)
):
    return note_repository.get_archived_notes(db=db, skip=skip, limit=limit, tag_name=tag)

@router.get("/by-tag/{tag_name}", response_model=List[note_schema.Note])
def get_notes_by_tag(
    tag_name: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Obtener notas filtradas por un tag específico"""
    return note_repository.get_notes_by_tag(db=db, tag_name=tag_name, skip=skip, limit=limit)

@router.get("/{note_id}", response_model=note_schema.Note)
def read_note(note_id: int, db: Session = Depends(get_db)):
    db_note = note_repository.get_note_by_id(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nota no encontrada")
    return db_note

@router.put("/{note_id}", response_model=note_schema.Note)
def update_note(note_id: int, note: note_schema.NoteUpdate, db: Session = Depends(get_db)):
    db_note = note_repository.get_note_by_id(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nota no encontrada")
    return note_repository.update_note(db=db, db_note=db_note, note_in=note)

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = note_repository.get_note_by_id(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nota no encontrada")
    note_repository.delete_note(db=db, db_note=db_note)
    return None

@router.patch("/{note_id}/archive", response_model=note_schema.Note)
def archive_note(note_id: int, db: Session = Depends(get_db)):
    db_note = note_repository.get_note_by_id(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nota no encontrada")
    if db_note.is_archived:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La nota ya está archivada")
    return note_repository.update_note(db=db, db_note=db_note, note_in=note_schema.NoteUpdate(is_archived=True))

@router.patch("/{note_id}/unarchive", response_model=note_schema.Note)
def unarchive_note(note_id: int, db: Session = Depends(get_db)):
    db_note = note_repository.get_note_by_id(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nota no encontrada")
    if not db_note.is_archived:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La nota ya está activa")
    return note_repository.update_note(db=db, db_note=db_note, note_in=note_schema.NoteUpdate(is_archived=False)) 