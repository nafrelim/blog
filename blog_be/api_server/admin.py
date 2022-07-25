from django.contrib import admin

from .models import Post

# Register your models here.


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("__str__",)
    list_filter = ("created",)
    search_fields = ("title",)
