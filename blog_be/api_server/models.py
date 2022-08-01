from django.contrib.auth.models import User
from django.db import models


class Post(models.Model):
    """
    Storing information about posts - title, content, author, number of views, creation or modification time
    """

    # author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Author')
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Author")
    title = models.CharField(
        max_length=255, null=False, blank=False, verbose_name="Post title"
    )
    content = models.TextField(null=False, blank=False, verbose_name="Post content")
    views = models.PositiveIntegerField(default=0, verbose_name="Count post views")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        d = self.created.strftime("%Y-%m-%d")
        h = self.created.strftime("%H:%M")
        return f"title: {self.title}, created: {d} {h}, author: {self.author.username}"
