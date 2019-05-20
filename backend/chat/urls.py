from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views

from chat import views

router = DefaultRouter()
router.register(r'channels', views.ChannelViewSet)
router.register(r'messages', views.MessageViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
        path('', include(router.urls)),
        path('channels/<int:pk>/messages', views.ChannelViewSet.messages),
        path('api-auth/', include('rest_framework.urls')),
        path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('api/token/refresh', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
