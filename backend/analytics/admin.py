from django.contrib import admin
from .models import TrafficLog, FlaggedBotIP
from django.db.models import Count
from django.db.models.functions import TruncWeek

# Register your models here.
@admin.register(TrafficLog)
class TrafficLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'method', 'path', 'status_code', 'ip_address')
    list_filter = ('status_code', 'method', 'timestamp')
    search_fields = ('path', 'ip_address', 'user_agent')

    def changelist_view(self, request, extra_context=None):
        # 1. Aggregate top 10 paths ordered by hit frequency
        top_pages = (
            TrafficLog.objects.values('path')
            .annotate(total_views=Count('id'))
            .order_by('-total_views')[:10]
        )

        # 2. Extract separate list structures for Chart.js inputs
        page_labels = [item['path'] for item in top_pages]
        page_data = [item['total_views'] for item in top_pages]

        # 3. Safely pass structural parameters into the template scope
        extra_context = extra_context or {}
        extra_context['top_page_labels'] = page_labels
        extra_context['top_page_data'] = page_data

        return super().changelist_view(request, extra_context=extra_context)

@admin.register(FlaggedBotIP)
class FlaggedBotIPAdmin(admin.ModelAdmin):
    # Displays the bot's IP, when it got caught, and the reason in a clean table
    list_display = ('ip_address', 'flagged_at', 'reason')
    # Allows you to easily filter by the date they were caught
    list_filter = ('flagged_at',)
    # Adds a search bar so you can look up specific IP addresses to unban them
    search_fields = ('ip_address', 'reason')

    # Override the default changelist view to pass chart data to the template
    def changelist_view(self, request, extra_context=None):
        # Aggregate total bots caught, grouped by week
        chart_data = (
            FlaggedBotIP.objects.annotate(week=TruncWeek('flagged_at'))
            .values('week')
            .annotate(total=Count('id'))
            .order_by('week')
        )

        # Format the data for Chart.js labels and values
        # e.g., labels = ["2026-W36", "2026-W37"], data = [12, 45]
        labels = [item['week'].strftime('%Y-W%W') if item['week'] else 'Unknown' for item in chart_data]
        data = [item['total'] for item in chart_data]

        # Inject this data into the template context
        extra_context = extra_context or {}
        extra_context['chart_labels'] = labels
        extra_context['chart_data'] = data

        return super().changelist_view(request, extra_context=extra_context)