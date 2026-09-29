from django.contrib.auth.models import User
from rest_framework import serializers

#import your models here.
from .models import Note
from blog.models import Article, Comment

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
        
class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'image', 'date', 'author', 'featured']
        read_only_fields = ['date', 'author']

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'article', 'user', 'text', 'created_at']
        read_only_fields = ['article', 'user', 'created_at']