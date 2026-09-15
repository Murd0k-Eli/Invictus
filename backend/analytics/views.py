from django.shortcuts import render
from django.http import HttpResponse
from .models import FlaggedBotIP

# Create your views here.

def secret_honeypot_view(request):
    # Extract IP address safely
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')

    # Add the IP to the banned bot list if it isn't already there
    if ip:
        FlaggedBotIP.objects.get_or_create(ip_address=ip)

    # Return a 200 OK with minimal text to look normal to the bot
    return HttpResponse("Success", content_type="text/plain")