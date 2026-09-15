from django.urls import path
from . import views
from api.views import CreateUserView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,)
from django.urls import include

urlpatterns = [
    path('notes/', views.NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/delete/<int:pk>/', views.NoteDeleteView.as_view(), name='note-delete'),
    #path('register/', CreateUserView.as_view(), name='user-register'),
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/', include('rest_framework.urls')),  # Add this line to include the login/logout views
    ]