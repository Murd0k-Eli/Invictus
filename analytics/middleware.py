# your_app/middleware.py
from .models import TrafficLog

class TrafficLoggerMiddleware:
    # A compiled regex of common bot, crawler, and spider signatures
    BOT_REGEX = re.compile(
        r'bot|crawler|spider|slurp|crawler|baidu|yandex|sogou|exabot|duckduckgo|ia_archiver|facebot|facebookexternalhit', 
        re.IGNORECASE
    )
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Process the response first to get the final HTTP status code
        response = self.get_response(request)

        # 2. Extract visitor details
        # Handle proxy setups (like Nginx, Cloudflare, or Heroku) if applicable
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')

        # Extract other metadata
        path = request.path
        method = request.method
        status_code = response.status_code
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        referrer = request.META.get('HTTP_REFERER', '')

        # 3. Save to database (skip static/media files to avoid bloat)
        if not path.startswith(('/static/', '/media/', '/admin/js/')) and not self.BOT_REGEX.search(user_agent):
            TrafficLog.objects.create(
                ip_address=ip,
                path=path,
                method=method,
                status_code=status_code,
                user_agent=user_agent,
                referrer=referrer
            )

        return response
