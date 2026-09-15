# In your main project urls.py (e.g., Invictus/urls.py)
from django.urls import path
from analytics.views import secret_honeypot_view
from django.http import HttpResponse


ROBOTS_TXT_CONTENT = (
    "User-agent: *\n"
    "Disallow: /hidden-panel/login/\n"  # <-- Tell honest bots to stay out; bad bots will head straight here!
    "Disallow: /admin/\n"
)


urlpatterns = [
    # ... your existing paths ...
    path('robots.txt', lambda r: HttpResponse(ROBOTS_TXT_CONTENT, content_type="text/plain"), name='robots'),
    # The trap URL
    path('hidden-panel/login/', secret_honeypot_view, name='honeypot_trap'),
]