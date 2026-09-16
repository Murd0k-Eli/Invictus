from django.urls import path
from .views import RegisterView, LogoutView
from django.contrib.auth import views as auth_views
from .views import dashboard_view

urlpatterns = [
        # Built-in Django login view (points to a template we will make)
        path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
        # Built-in logout view
        path('logout/', auth_views.LogoutView.as_view(), name ='logout'),
        path('register/', RegisterView.as_view(), name='register'),

        # Custom dashboard page (protected view)
        path('dashboard/', dashboard_view, name='dashboard'),
]    
