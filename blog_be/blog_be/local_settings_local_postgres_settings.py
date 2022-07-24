"""
Data to be connected to the database locally
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
