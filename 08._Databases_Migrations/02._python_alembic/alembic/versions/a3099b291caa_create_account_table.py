"""create account table

Revision ID: a3099b291caa
Revises: 
Create Date: 2025-11-06 13:53:11.366339

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3099b291caa'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    accounts_table = op.create_table(
        'accounts',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('description', sa.Unicode(200)),
    )
    op.bulk_insert(accounts_table,
    [
        {'id': 1, 'name': 'John Smith', 'description': 'CEO'},
        {'id': 2, 'name': 'Ed Williams', 'description': 'CTO'},
        {'id': 3, 'name': 'Wendy Jones', 'description': 'CFO'},
    ]
)

def downgrade():
    op.drop_table('accounts')