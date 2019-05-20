from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .serializers import UserSerializer, ChannelSerializer, MessageSerializer
from .models import Channel, Message

class ChannelViewSet(viewsets.ModelViewSet):
    """
    This viewset provides 'list', 'create', 'retrieve',
    'update' and 'destroy' actions.

    Additionally, it provides the custom 'post_message' action
    """
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer

    #FIXME add this
    #permission_classes =

    @api_view(['GET', 'POST'])
    @permission_classes((IsAuthenticated, ))
    def messages(self, pk):
        
        if self.method == 'GET':
            messages = Message.objects.filter(channel=pk)
            serializer = MessageSerializer(messages, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = MessageSerializer(data=self.data)
            if serializer.is_valid():
                serializer.save(owner=self.user, timestamp=timezone.now())
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset provides 'list' and 'detail' functionality
    """
    permission_classes = (IsAuthenticated,)
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset provides 'list' and 'detail' functionality
    """
    queryset=User.objects.all()
    serializer_class = UserSerializer
