from sqlalchemy import Column, Integer, String, Boolean, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

# Tabla de asociación para la relación many-to-many entre Note y Tag
note_tag = Table('note_tags', Base.metadata,
    Column('note_id', Integer, ForeignKey('notes.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), index=True, nullable=False)
    content = Column(String, nullable=False)
    is_archived = Column(Boolean, default=False, server_default='false', nullable=False)
    is_pinned = Column(Boolean, default=False, server_default='false', nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relación con tags
    tags = relationship("Tag", secondary=note_tag, back_populates="notes")

    def __repr__(self):
        return f"<Note(id={self.id}, title='{self.title}')>" 

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
    
    # Relación con notas
    notes = relationship("Note", secondary=note_tag, back_populates="tags")
    
    def __repr__(self):
        return f"<Tag(id={self.id}, name='{self.name}')>" 