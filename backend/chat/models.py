from django.conf import settings
from django.db import models
from django.utils import timezone

class Channel(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Message(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    channel = models.ForeignKey('Channel', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.author}, {self.channel.name}: {self.text} @ {self.timestamp}"
