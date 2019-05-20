from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Channel, Message

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class ChannelSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True, allow_blank=False, max_length=20)

    class Meta:
        model = Channel
        fields = ('id', 'name')

    def create(self, validated_data):
        """
        Create and return a new named `Channel` instance
        """
        return Channel.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update name of and return an existing `Channel` instance
        """
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

class MessageSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)
    author = UserSerializer()
    text = serializers.CharField(required=True, allow_blank=True, max_length=200)
    channel = ChannelSerializer()

    class Meta:
        model = Message
        fields = ('id', 'author', 'text', 'channel')

    def create(self, validated_data):
        """
        Post and return a new `Message` instance to a channel
        """
        return Message.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Edit and return a `Message` instance
        """
        instance.text = validated_data.get('text', instance.text)
        instance.save()
        return instance


