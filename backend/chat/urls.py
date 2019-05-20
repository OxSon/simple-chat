from django.urls import path, include
from rest_framework.routers import DefaultRouter

from chat import views

router = DefaultRouter()
router.register(r'channels', views.ChannelViewSet)
router.register(r'messages', views.MessageViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
        path('', include(router.urls)),
        path('channels/<int:pk>/messages', views.ChannelViewSet.messages)
]
