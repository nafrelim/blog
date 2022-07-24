"""
Data for database connection in Docker
"""

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'HOST': 'localhost',
        'PORT': 5432,
        'NAME': 'blog',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
    }
}
