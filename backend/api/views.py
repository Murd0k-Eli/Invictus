from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import AccessToken
from api.serializers import UserSerializer, NoteSerializer
from api.serializers import ArticleSerializer, CommentSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import NoteSerializer, ArticleSerializer # Add ArticleSerializer here
from .models import Note
from blog.models import Article, Comment

# Create your views here.
def index_view(request):
    return render(request, 'website/baseReact.html')

class SessionBridgeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.GET.get('token')
        if not token:
            return redirect('/')

        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            login(request, user)
            return redirect('/')
        except Exception as e:
            print(f"Session bridge error: {e}")
            return redirect('/')

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow any user to create an account 

class NoteListCreateView(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)  # Return only the notes of the logged-in user
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class NoteDeleteView(generics.DestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)  # Return only the notes of the logged-in user
    
    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied("You do not have permission to delete this note.") # type: ignore
        instance.delete()

class ArticleCreateAPIView(generics.CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        article_id = self.kwargs.get('pk')
        return Comment.objects.filter(article_id=article_id)

    def perform_create(self, serializer):
        article_id = self.kwargs.get('pk')
        try:
            article = Article.objects.get(pk=article_id)
            serializer.save(user=self.request.user, article=article)
        except Article.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Article not found")

class CommentDeleteAPIView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        # The get_queryset already filters by user, but we can be explicit
        instance.delete()