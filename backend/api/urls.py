from django.urls import path, re_path
from . import views
from api.views import CreateUserView, index_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,)
from django.urls import include

urlpatterns = [
    # 1. Group ALL REST Framework endpoints strictly under api/
    path('user/register/', CreateUserView.as_view(), name='register-deprecated'),
    path('notes/', views.NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/delete/<int:pk>/', views.NoteDeleteView.as_view(), name='note-delete'),

    # 2. The Catch-All: Send everything else to React!
    # If a URL doesn't start with admin/ or api/, let React Router take care of it.
    re_path(r'^.*$', index_view, name='frontend'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/', include('rest_framework.urls')),  # Add this line to include the login/logout views
    ]