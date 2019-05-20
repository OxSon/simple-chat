from django.conf import settings
from django.db import models
from django.utils import timezone

class Channel(models.Model):
    name = models.CharField(max_length=20)

    class Meta:
        ordering = ('name',)

class Message(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    channel = models.ForeignKey('Channel', on_delete=models.CASCADE)

    class Meta:
        ordering = ('timestamp',)
