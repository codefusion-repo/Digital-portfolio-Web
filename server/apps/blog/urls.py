from django.urls import path

from .views import *

urlpatterns = [
    path('list', BlogListView.as_view()),
    path('by_category', ListPostByCategoryView.as_view()),
    path('detail/<slug>', PostDetailView.as_view()),
    path('search', SearchBlogView.as_view()),
    path('author_posts', AuthorPostListView.as_view()),
    path('create_post', CreatePostView.as_view()),
    path('edit_post', EditPostView.as_view()),
    path('upload/', upload, name='upload'),
    path('delete/<slug>', DeletePostView.as_view()),
]
