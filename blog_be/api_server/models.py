import random
import string

from django.contrib.auth.models import User
from django.db import models
from django.db.models import signals
from django.dispatch import receiver
from django.urls import reverse
from django.utils.text import slugify


class Post(models.Model):
    """
    Storing information about posts - title, content, author, number of views, creation or modification time
    """

    # author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Author')
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Author")
    slug = models.SlugField(max_length=100, unique=True)
    title = models.CharField(max_length=255, verbose_name="Post title")
    content = models.TextField(verbose_name="Post content")
    views = models.PositiveIntegerField(default=0, verbose_name="Count post views")
    created = models.DateTimeField(auto_now=True, verbose_name="Created")
    updated = models.DateTimeField(auto_now=True, verbose_name="Updated")

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        d = self.created.strftime("%Y-%m-%d")
        h = self.created.strftime("%H:%M")
        return f"title: {self.title}, created: {d} {h} by {self.author.username}"


@receiver(signals.pre_save, sender=Post)
def populate_slug(sender, instance, **kwargs):
    rand_slug = "".join(
        random.choice(string.ascii_letters + string.digits) for _ in range(6)
    )
    instance.slug = slugify(rand_slug + "-" + instance.title)


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    comment_author = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="comment author"
    )
    content = models.TextField()
    created = models.DateTimeField(auto_now=True, verbose_name="Created")

    class Meta:
        ordering = ["created"]

    def __str__(self):
        return f"Comment {self.content} by {self.comment_author}"
