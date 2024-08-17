from django.urls import path

from .views import *

urlpatterns = [
    path('list', PortfolioListView.as_view()),
    path('filter', PortfolioFilterView.as_view()),
    path('project/<slug>', PortfolioDetailView.as_view()),
    path('author_projects', AuthorProjectListView.as_view()),
    path('create_project', CreateProjectView.as_view()),
    path('edit_project', EditProjectView.as_view()),
    path('delete/<slug>', DeleteProjectView.as_view()),
    path('upload/', upload, name='upload'),
]