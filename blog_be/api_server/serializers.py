from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Post


class PostSerializer(serializers.HyperlinkedModelSerializer):
    author = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all())

    class Meta:
        url = serializers.HyperlinkedIdentityField(
            view_name='post-detail',
        )
        verbose_name = 'Post'
        model = Post
        fields = ['url', 'id', 'title', 'content', 'created', 'updated', 'author']
        # exclude = ['views']


class CountViewsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        url = serializers.HyperlinkedIdentityField(
            view_name='view-detail',
            lookup_field='views'
        )
        verbose_name = 'CountViews'
        model = Post
        fields = ['url', 'id', 'views']
