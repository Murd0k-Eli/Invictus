from django.shortcuts import render
from django.utils import timezone

def about_view(request):
    return render(request, 'website/about.html')

def home_view(request):
    return render(request, 'website/home.html')

def contact_view(request):
    return render(request, 'website/contact.html')

def privacy_view(request):
    last_updated = timezone.now()  # Get the current date and time
    return render(request, 'website/privacy.html')

def terms_view(request):
    last_updated = timezone.now()  # Get the current date and time
    return render(request, 'website/terms.html', {'last_updated': last_updated})