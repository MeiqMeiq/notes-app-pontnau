from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas import note_schema
from app.repositories import tag_repository
from app.models.note_model import Tag
from app.database import get_db

router = APIRouter(
    prefix="/tags",
    tags=["tags"]
)

@router.get("/", response_model=List[note_schema.Tag])
def get_all_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los tags disponibles"""
    return tag_repository.get_all_tags(db=db, skip=skip, limit=limit)

@router.post("/", response_model=note_schema.Tag, status_code=status.HTTP_201_CREATED)
def create_tag(tag: note_schema.TagCreate, db: Session = Depends(get_db)):
    """Crear un nuevo tag"""
    db_tag = tag_repository.get_tag_by_name(db=db, name=tag.name)
    if db_tag:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                           detail=f"El tag '{tag.name}' ya existe")
    return tag_repository.create_tag(db=db, name=tag.name)

@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    """Eliminar un tag por su ID"""
    # Primero, verificar si el tag existe
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if db_tag is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Tag con id {tag_id} no encontrado")
    
    # Eliminar el tag (esto también eliminará las relaciones en note_tags)
    tag_repository.delete_tag(db=db, db_tag=db_tag)
    
    return {"status": "success", "message": f"Tag {tag_id} eliminado correctamente"} 