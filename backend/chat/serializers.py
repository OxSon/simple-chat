from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Channel, Message

class ChannelSerializer(serializers.ModelSerializer):
     class Meta:
         model = Channel
         fields = ('id', 'name', 'messages')

class MessageSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Message
        #FIXME correct way to do owner? source?
        fields = ('id', 'owner', 'channel', 'timestamp', 'text')


class UserSerializer(serializers.ModelSerializer):
    #FIXME add predicate to filter
    messages = serializers.PrimaryKeyRelatedField(many=True, queryset=Message.objects.filter())

    class Meta:
        model = User
        fields = ('id', 'username', 'messages')
