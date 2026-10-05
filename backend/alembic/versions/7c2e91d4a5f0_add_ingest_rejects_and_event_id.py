"""Add ingest_rejects table and events.event_id

Revision ID: 7c2e91d4a5f0
Revises: 134b25a576b3
Create Date: 2026-10-04 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '7c2e91d4a5f0'
down_revision: Union[str, Sequence[str], None] = '134b25a576b3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('ingest_rejects',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('batch_id', sa.String(length=255), nullable=False),
    sa.Column('stage', sa.String(length=20), nullable=False),
    sa.Column('reason', sa.Text(), nullable=False),
    sa.Column('raw_payload', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ingest_rejects_id'), 'ingest_rejects', ['id'], unique=False)
    op.create_index(op.f('ix_ingest_rejects_batch_id'), 'ingest_rejects', ['batch_id'], unique=False)
    op.create_index(op.f('ix_ingest_rejects_stage'), 'ingest_rejects', ['stage'], unique=False)

    op.add_column('events', sa.Column('event_id', sa.String(length=255), nullable=True))
    op.create_index(op.f('ix_events_event_id'), 'events', ['event_id'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_events_event_id'), table_name='events')
    op.drop_column('events', 'event_id')

    op.drop_index(op.f('ix_ingest_rejects_stage'), table_name='ingest_rejects')
    op.drop_index(op.f('ix_ingest_rejects_batch_id'), table_name='ingest_rejects')
    op.drop_index(op.f('ix_ingest_rejects_id'), table_name='ingest_rejects')
    op.drop_table('ingest_rejects')
