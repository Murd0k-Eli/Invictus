from django.shortcuts import render
from django.contrib.auth.models import User
from api.serializers import UserSerializer, NoteSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

# Import your models here.
from .models import Note

# Create your views here.
def index_view(request):
    return render(request, 'website/baseReact.html')

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
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)  # Set the author to the currently logged-in user
        else:
            raise PermissionDenied("You must be logged in to create a note.") # type: ignore

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