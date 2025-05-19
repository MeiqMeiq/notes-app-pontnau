from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Esquema básico de tag
class TagBase(BaseModel):
    name: str

# Esquema para crear tags
class TagCreate(TagBase):
    pass

# Esquema para respuesta de tags
class Tag(TagBase):
    id: int

    class Config:
        from_attributes = True

# Esquema básico de nota simplificado
class NoteBase(BaseModel):
    title: str
    content: str

# Esquema para crear notas (usa los mismos campos que NoteBase)
class NoteCreate(NoteBase):
    tags: Optional[List[str]] = None

# Esquema para actualizar notas (todos los campos son opcionales)
class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_archived: Optional[bool] = None
    is_pinned: Optional[bool] = None
    tags: Optional[List[str]] = None

# Esquema completo de nota para respuestas API
class Note(NoteBase):
    id: int
    is_archived: bool
    is_pinned: bool
    created_at: datetime
    updated_at: datetime
    tags: List[Tag] = []

    class Config:
        from_attributes = True 