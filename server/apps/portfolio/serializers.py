from rest_framework import serializers
from .models import *
from apps.user.serializers import UserPortfolioSerializer

class ProjectSerializer(serializers.ModelSerializer):
    author=UserPortfolioSerializer() 
    class Meta:
        model=Project
        fields = [
            'id',
            'title',
            'slug',
            'thumbnail',
            'author',
            'description',
            'content',
            'published',
            'views',
            'category', 
            'status'
        ]

class ProjectsListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Project
        fields = [
            'id',
            'title',
            'slug',
            'thumbnail',
            'description',
            'views',
            'category',
            'status'
        ]