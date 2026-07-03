from django.contrib.auth.models import User
from rest_framework import serializers

#import your models here.
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}   #Tells django that it wants to write the password but not read it. This is for security reasons.

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')  # This will display the username of the author instead of the user ID.

    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'author']
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'author': {'read_only': True},  # Ensure that the author field is read-only
        }