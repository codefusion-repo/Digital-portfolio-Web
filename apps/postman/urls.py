from django.urls import path

from .views import *

urlpatterns = [
    path('send_contact_email', sendContactEmail.as_view()),
]