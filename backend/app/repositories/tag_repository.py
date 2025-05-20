from sqlalchemy.orm import Session
from ..models.note_model import Tag, note_tag
from ..schemas import note_schema
from typing import List, Optional
from sqlalchemy import delete

# Operaciones CRUD para tags

def create_tag(db: Session, name: str) -> Tag:
    """Crear un nuevo tag en la base de datos"""
    db_tag = Tag(name=name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def get_tag_by_name(db: Session, name: str) -> Optional[Tag]:
    """Obtener un tag por su nombre"""
    return db.query(Tag).filter(Tag.name == name).first()

def get_or_create_tag(db: Session, name: str) -> Tag:
    """Obtener un tag por nombre o crearlo si no existe"""
    db_tag = get_tag_by_name(db=db, name=name)
    if db_tag is None:
        db_tag = create_tag(db=db, name=name)
    return db_tag

def get_all_tags(db: Session, skip: int = 0, limit: int = 100) -> List[Tag]:
    """Obtener todos los tags"""
    return db.query(Tag).offset(skip).limit(limit).all()

def delete_tag(db: Session, db_tag: Tag) -> None:
    """Eliminar un tag de la base de datos"""
    # Primero, eliminar todas las relaciones con notas en la tabla de asociación
    db.execute(delete(note_tag).where(note_tag.c.tag_id == db_tag.id))
    
    # Luego, eliminar el tag
    db.delete(db_tag)
    db.commit() 