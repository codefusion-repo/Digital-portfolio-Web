from django.urls import path

from .views import *

urlpatterns = [
    path('login', Login.as_view()),
    path('send_reset_email', send_password_reset_email.as_view()),
    path('reset_password_confirm', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]