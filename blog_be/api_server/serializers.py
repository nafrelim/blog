from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Comment, Post


class PostSerializer(serializers.HyperlinkedModelSerializer):
    author = serializers.SlugRelatedField(
        slug_field="username", queryset=User.objects.all()
    )

    slug = serializers.SlugField(read_only=True)

    class Meta:
        url = serializers.HyperlinkedIdentityField(
            view_name="post-detail",
        )
        verbose_name = "Post"
        model = Post
        required = ("title", "content", "author")
        fields = [
            "url",
            "id",
            "slug",
            "title",
            "content",
            "created",
            "updated",
            "author",
        ]


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    comment_author = serializers.SlugRelatedField(
        slug_field="username", queryset=User.objects.all()
    )

    class Meta:
        url = serializers.HyperlinkedIdentityField(
            view_name="comment-detail",
        )
        verbose_name = "Comment"
        model = Comment
        fields = ["url", "id", "content", "post", "comment_author", "created"]


class PostCommentsSerializer(serializers.HyperlinkedModelSerializer):
    comment_author = serializers.SlugRelatedField(
        slug_field="username", queryset=User.objects.all()
    )

    class Meta:
        url = serializers.HyperlinkedIdentityField(
            view_name="comment-detail",
        )
        verbose_name = "Comment"
        model = Comment
        fields = ["url", "id", "content", "post", "comment_author", "created"]


class CountViewsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        url = serializers.HyperlinkedIdentityField(
            view_name="view-detail", lookup_field="views"
        )
        verbose_name = "CountViews"
        model = Post
        fields = ["url", "id", "views"]


class ReportSerializer(serializers.Serializer):
    number_of_posts = serializers.IntegerField()
    max_views = serializers.IntegerField()
    min_views = serializers.IntegerField()
    avg_views = serializers.IntegerField()
    sum_views = serializers.IntegerField()
    top_5 = serializers.ListField()
    last_5 = serializers.ListField()
    max_sub_15 = serializers.ListField()
    min_add_15 = serializers.ListField()
    number_of_posts_views = serializers.ListField()


class ParametersSerializer(serializers.Serializer):
    posts_on_page = serializers.IntegerField()
    authors = serializers.ListField()
