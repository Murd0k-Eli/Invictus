from django.contrib import admin
from .models import TrafficLog

# Register your models here.
@admin.register(TrafficLog)
class TrafficLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'method', 'path', 'status_code', 'ip_address')
    list_filter = ('status_code', 'method', 'timestamp')
    search_fields = ('path', 'ip_address', 'user_agent')