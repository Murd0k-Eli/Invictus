from django.db import models

# Create your models here.
class TrafficLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    path = models.CharField(max_length=1024)
    method = models.CharField(max_length=10)
    status_code = models.IntegerField()
    user_agent = models.TextField(null=True, blank=True)
    referrer = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.timestamp} - {self.method} {self.path} ({self.status_code})"

class FlaggedBotIP(models.Model):
    ip_address = models.GenericIPAddressField(unique=True)
    flagged_at = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=255, default="Honeypot Triggered")

    def __str__(self):
        return f"Bot IP: {self.ip_address}"