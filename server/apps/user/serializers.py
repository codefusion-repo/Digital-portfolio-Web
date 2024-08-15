from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from .models import UserAccount

class UserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = UserAccount
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'is_staff',
            'is_superuser',
        ]

class UserPortfolioSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = UserAccount
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
        ]