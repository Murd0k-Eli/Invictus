from django.db import models
from tinymce.models import HTMLField
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.

class Article(models.Model):
    title = models.CharField(max_length = 255)
    content = HTMLField()
    image = models.ImageField(upload_to = 'images/', blank=True, null=True, default = 'images/default.png')
    date = models.DateTimeField(default = timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    featured = models.BooleanField(default = False)
    likes = models.ManyToManyField(User, related_name = 'likes', blank = True)

    def __str__(self):
        return self.title + " | " + str(self.author) + " | " + str(self.date)