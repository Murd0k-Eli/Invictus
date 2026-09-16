"""
URL configuration for Invictus project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
#from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.http import HttpResponse
from rest_framework.routers import DefaultRouter
from api.views import NoteListCreateView, NoteDeleteView, CreateUserView

#router = DefaultRouter()
#router.register(r'notes', NoteListCreateView , basename='notes')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'),
    path('about/', views.about_view, name='about'),
    path('contact/', views.contact_view, name='contact'),
    path('privacy/', views.privacy_view, name='privacy'),
    path('terms/', views.terms_view, name='terms'),
    path('robots.txt', TemplateView.as_view(template_name='robots.txt', content_type="text/plain"), name='robots'),
    path('sitemap.xml', TemplateView.as_view(template_name='sitemap.xml', content_type='application/xml'), name='sitemap'),

    path('blog/', include('blog.urls')),
    
    path('analytics/', include('analytics.urls')),  # Include the URLs from the analytics app
    path('accounts/', include('users.urls')),

    # 📡 Django REST Framework API Endpoints
    path('api/', include('api.urls')),  # Include the URLs from the api app
    # ⚡ ROOT PATH: Maps the homepage root directly to the React application template
    path('react/', TemplateView.as_view(template_name='website/baseReact.html'), name='frontend-root'),

    path("polls/", include("polls.urls")),
    path("__reload__/", include("django_browser_reload.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # Serve media files during development
