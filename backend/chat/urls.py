from django.urls import path, include#, re_path
from rest_framework.routers import DefaultRouter
#from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from chat import views

router = DefaultRouter()
router.register(r'channels', views.ChannelViewSet)
router.register(r'messages', views.MessageViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
        path('', include(router.urls)),
        path('channels/<int:pk>/messages', views.ChannelViewSet.messages),
#        re_path(r'^api-token-auth/', obtain_jwt_token),
#        re_path(r'^api-token-refresh/', refresh_jwt_token),
]
