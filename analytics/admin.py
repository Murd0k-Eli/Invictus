from django.contrib import admin
from .models import TrafficLog, FlaggedBotIP

# Register your models here.
@admin.register(TrafficLog)
class TrafficLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'method', 'path', 'status_code', 'ip_address')
    list_filter = ('status_code', 'method', 'timestamp')
    search_fields = ('path', 'ip_address', 'user_agent')

@admin.register(FlaggedBotIP)
class FlaggedBotIPAdmin(admin.ModelAdmin):
    # Displays the bot's IP, when it got caught, and the reason in a clean table
    list_display = ('ip_address', 'flagged_at', 'reason')
    
    # Allows you to easily filter by the date they were caught
    list_filter = ('flagged_at',)
    
    # Adds a search bar so you can look up specific IP addresses to unban them
    search_fields = ('ip_address', 'reason')