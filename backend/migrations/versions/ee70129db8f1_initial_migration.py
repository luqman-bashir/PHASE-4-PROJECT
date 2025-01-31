"""Initial migration.

Revision ID: ee70129db8f1
Revises: e6fa2592fb84
Create Date: 2025-01-30 03:55:32.334558

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ee70129db8f1'
down_revision = 'e6fa2592fb84'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('is_approved')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_approved', sa.BOOLEAN(), nullable=False))

    # ### end Alembic commands ###
