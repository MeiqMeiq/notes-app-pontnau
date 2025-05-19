from sqlalchemy.orm import Session
from app.models.note_model import Note, Tag
from app.schemas import note_schema
from typing import List, Optional
from . import tag_repository

# Operaciones CRUD para notas

def create_note(db: Session, note: note_schema.NoteCreate) -> Note:
    """Crear una nueva nota en la base de datos"""
    db_note = Note(title=note.title, content=note.content)
    
    # Procesar tags si están presentes
    if note.tags:
        for tag_name in note.tags:
            tag = tag_repository.get_or_create_tag(db=db, name=tag_name)
            db_note.tags.append(tag)
    
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_note_by_id(db: Session, note_id: int) -> Optional[Note]:
    """Obtener una nota por su ID"""
    return db.query(Note).filter(Note.id == note_id).first()

def get_active_notes(db: Session, skip: int = 0, limit: int = 100, tag_name: Optional[str] = None) -> List[Note]:
    """Obtener notas activas (no archivadas), opcionalmente filtradas por tag"""
    query = db.query(Note).filter(Note.is_archived == False)
    
    if tag_name:
        tag = tag_repository.get_tag_by_name(db=db, name=tag_name)
        if tag:
            query = query.filter(Note.tags.contains(tag))
    
    return query.offset(skip).limit(limit).all()

def get_archived_notes(db: Session, skip: int = 0, limit: int = 100, tag_name: Optional[str] = None) -> List[Note]:
    """Obtener notas archivadas, opcionalmente filtradas por tag"""
    query = db.query(Note).filter(Note.is_archived == True)
    
    if tag_name:
        tag = tag_repository.get_tag_by_name(db=db, name=tag_name)
        if tag:
            query = query.filter(Note.tags.contains(tag))
    
    return query.offset(skip).limit(limit).all()

def update_note(db: Session, db_note: Note, note_in: note_schema.NoteUpdate) -> Note:
    """Actualizar una nota existente"""
    note_data = note_in.dict(exclude_unset=True, exclude={"tags"})
    
    for key, value in note_data.items():
        setattr(db_note, key, value)
    
    # Actualizar tags si están presentes en la actualización
    if note_in.tags is not None:
        # Limpiar tags existentes
        db_note.tags = []
        
        # Añadir los nuevos tags
        for tag_name in note_in.tags:
            tag = tag_repository.get_or_create_tag(db=db, name=tag_name)
            db_note.tags.append(tag)
    
    db.commit()
    db.refresh(db_note)
    return db_note

def delete_note(db: Session, db_note: Note) -> None:
    """Eliminar una nota de la base de datos"""
    db.delete(db_note)
    db.commit() 

def get_notes_by_tag(db: Session, tag_name: str, skip: int = 0, limit: int = 100) -> List[Note]:
    """Obtener notas filtradas por tag"""
    tag = tag_repository.get_tag_by_name(db=db, name=tag_name)
    if not tag:
        return []
    
    return db.query(Note).filter(Note.tags.contains(tag)).offset(skip).limit(limit).all() 