"""add_is_pinned_column

Revision ID: cc2ed388f89c
Revises: d673d55ffff3
Create Date: 2025-05-18 20:41:42.755246

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'cc2ed388f89c'
down_revision = 'd673d55ffff3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_notes_id', table_name='notes')
    op.drop_index('ix_notes_title', table_name='notes')
    op.drop_table('notes')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('notes',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('title', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('content', sa.TEXT(), autoincrement=False, nullable=False),
    sa.Column('is_archived', sa.BOOLEAN(), server_default=sa.text('false'), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.Column('updated_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='notes_pkey')
    )
    op.create_index('ix_notes_title', 'notes', ['title'], unique=False)
    op.create_index('ix_notes_id', 'notes', ['id'], unique=False)
    # ### end Alembic commands ### 