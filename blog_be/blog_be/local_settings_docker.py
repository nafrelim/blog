"""
Data for database connection in Docker
"""

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        # "HOST": "localhost",
        "HOST": "db",
        "PORT": 5432,
        "NAME": "blog",
        "USER": "postgres",
        "PASSWORD": "postgres",
    }
}
