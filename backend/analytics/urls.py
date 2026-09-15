# In your main project urls.py (e.g., Invictus/urls.py)
from django.urls import path
from analytics.views import secret_honeypot_view
from django.http import HttpResponse


# analytics/urls.py

# A comprehensive list blocking major AI scrapers, while keeping your honeypot active
ROBOTS_TXT_CONTENT = (
    # 1. Block OpenAI (ChatGPT / GPTBot)
    "User-agent: GPTBot\n"
    "Disallow: /\n\n"
    
    # 2. Block Anthropic (Claude / ClaudeBot)
    "User-agent: ClaudeBot\n"
    "Disallow: /\n\n"
    
    # 3. Block Google AI Scrapers (Gemini / Vertex AI)
    "User-agent: Google-Extended\n"
    "Disallow: /\n\n"
    
    # 4. Block Perplexity AI
    "User-agent: PerplexityBot\n"
    "Disallow: /\n\n"
    
    # 5. Global rules for all other crawlers + your honeypot trap
    "User-agent: *\n"
    "Disallow: /analytics/hidden-panel/login/\n"
    "Disallow: /admin/\n"
)



urlpatterns = [
    # ... your existing paths ...
    path('robots.txt', lambda r: HttpResponse(ROBOTS_TXT_CONTENT, content_type="text/plain"), name='robots_file'),
    # The trap URL
    path('hidden-panel/login/', secret_honeypot_view, name='honeypot_trap'),
]