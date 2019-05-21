from django.db import models


class Channel(models.Model):
    """
    Channel is a named collection of messages
    """
    name = models.CharField(max_length=20)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created',)


class Message(models.Model):
    """
    A Message is an arbitrarily long unit of Unicode text
    associated with a user and a channel
    """

    # FIXME correct way to do owner? source?
    owner = models.ForeignKey(
            'auth.User', related_name='messages',
            on_delete=models.CASCADE)

    channel = models.ForeignKey(
            'Channel', related_name='messages',
            on_delete=models.CASCADE)

    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.TextField()

    class Meta:
        ordering = ('timestamp',)
