from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.HyperlinkedModelSerializer):
    author = serializers.SlugRelatedField(
        slug_field="username", queryset=User.objects.all()
    )

    class Meta:
        url = serializers.HyperlinkedIdentityField(
            view_name="post-detail",
        )
        verbose_name = "Post"
        model = Post
        fields = ["url", "id", "title", "content", "created", "updated", "author"]


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
