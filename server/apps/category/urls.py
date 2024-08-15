from django.urls import path

from .views import *

urlpatterns = [
    path('list', ListCategoryView.as_view())
]