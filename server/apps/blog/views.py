from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from .models import Post, ViewCount
from apps.category.models import Category

from .serializers import PostListSerializer, PostSerializer
from .pagination import SmallSetPagination, MediumSetPagination, LargeSetPagination

from django.db.models.query_utils import Q

from .permissions import IsPostAuthorOrReadOnly, AuthorPermission
from rest_framework.parsers import MultiPartParser, FormParser

from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from ckeditor_uploader.views import upload as ckeditor_upload
import json
from django.core.files.storage import FileSystemStorage
import humanize
from django.db import IntegrityError
from slugify import slugify

class BlogListView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, format=None):
        if Post.postobjects.all().exists():
            posts = Post.postobjects.all()
            paginator = SmallSetPagination()
            results = paginator.paginate_queryset(posts, request)
            serializer = PostListSerializer(posts, many=True)
            return Response({'posts': serializer.data}, status=status.HTTP_200_OK)
            return paginator.get_paginated_response({'posts': serializer.data})
        else:
            return Response({'error': 'No post found'}, status=status.HTTP_404_NOT_FOUND)

class ListPostByCategoryView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, format=None):
        if Post.postobjects.all().exists():
            slug = request.query_params.get('slug')
            category = Category.objects.get(slug=slug)
            posts = Post.postobjects.all().order_by('-published')

            if category.parent:
                posts = posts.filter(category=category)
            else:
                if not Category.objects.filter(parent=category).exists():
                    posts = posts.filter(category=category)
                else:
                    sub_categories = Category.objects.filter(parent=category)
                    filtered_categories = [category]

                    for cat in sub_categories:
                        filtered_categories.append(cat)

                    filtered_categories = tuple(filtered_categories)

                    posts = posts.filter(category__in=filtered_categories)

            paginator = SmallSetPagination()
            results = paginator.paginate_queryset(posts, request)
            serializer = PostListSerializer(posts, many=True)
            return Response({'posts': serializer.data}, status=status.HTTP_200_OK)

            return paginator.get_paginated_response({'posts': serializer.data})
        else:
            return Response({'error': 'No posts found'}, status=status.HTTP_404_NOT_FOUND)
        
class PostDetailView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, slug, format=None):

        if Post.objects.filter(slug=slug).exists():   
            post = Post.objects.get(slug=slug)
            serializer = PostSerializer(post)

            address = request.META.get('HTTP_X_FORWARDED_FOR')
            if address:
                ip = address.split(',')[-1].strip()
            else:
                ip = request.META.get('REMOTE_ADDR')

            if not ViewCount.objects.filter(post=post, ip_address=ip):
                view = ViewCount(post=post, ip_address=ip)
                view.save()
                post.views += 1
                post.save()

            return Response({'post': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error':'Post doesnt exit'}, status=status.HTTP_404_NOT_FOUND)
        
class SearchBlogView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, format=None):
        search_term = request.query_params.get('s')
        matches = Post.postobjects.filter(
            Q(title__icontains=search_term) | 
            Q(description__icontains=search_term) |
            Q(category__name__icontains=search_term)
            )
        
        paginator = SmallSetPagination()
        results = paginator.paginate_queryset(matches, request)
        serializer = PostListSerializer(matches, many=True)

        return Response({'filtered_posts': serializer.data}, status=status.HTTP_200_OK)
        # return paginator.get_paginated_response({'filtered_posts': serializer.data})
    
class AuthorPostListView(APIView):
    permission_classes = (permissions.IsAdminUser, IsPostAuthorOrReadOnly,)
    def get(self, request, format=None):
        user = self.request.user
        
        if Post.objects.filter(author=user.id).exists():   
            posts = Post.objects.filter(author=user.id)

            paginator = SmallSetPagination()
            results = paginator.paginate_queryset(posts, request)
            serializer = PostListSerializer(posts, many=True)
            return Response({'author_posts': serializer.data}, status=status.HTTP_200_OK)
            return paginator.get_paginated_response({'author_posts': serializer.data})
        else:
            return Response({'error':'Posts does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
class CreatePostView(APIView):
    permission_classes = (permissions.IsAdminUser, AuthorPermission,)
    def post(self, request, format=None):
        data = self.request.data
        try:
            c = Category.objects.get(id=data['category'])
            Post.objects.create(
                title=data['title'],
                slug=data['slug'],
                thumbnail=data['thumbnail'],
                author=self.request.user,
                description=data['description'],
                content=data['content'],
                time_read=data['time_read'],
                category=c,
                status=data['status'],
            )  
            return Response({'success': 'Post created'}, status=status.HTTP_200_OK)
        except IntegrityError as error:
            mensaje = f"An error occurred: {error}"
            mensaje_humanizado = ' '.join(word.capitalize() for word in str(mensaje).split('_'))
            print('mensaje: '+ mensaje_humanizado)
            return Response({'error': mensaje_humanizado}, status=status.HTTP_200_OK)
        except Exception as error:
            mensaje = f"An error occurred: {error}"
            mensaje_humanizado = ' '.join(word.capitalize() for word in str(mensaje).split('_'))
            print('mensaje: '+ mensaje_humanizado)
            return Response({'error': mensaje_humanizado}, status=status.HTTP_200_OK)


class EditPostView(APIView):
    permission_classes = (permissions.IsAdminUser, AuthorPermission, IsPostAuthorOrReadOnly)
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, format=None):
        data = self.request.data

        if Post.objects.filter(id=data['id']):
            post = Post.objects.get(id=data['id'])
        else:
            return Response({ 'error': 'Post no found' }, status=status.HTTP_404_NOT_FOUND)
        try:
            if not Post.objects.filter(title=data['title']).exists():
                if post.title != data['title']:
                    post.title = data['title']
                    post.slug = slugify(data['title'])

            post.description = data['description']

            print('thumbnail: ', data['thumbnail'])
            if data['thumbnail']:
                post.thumbnail = data['thumbnail']
                
            post.content = data['content']
            c = Category.objects.get(id=data['category'])
            post.category = c

            if int(data['time_read']) >= 0:
                post.time_read = int(data['time_read'])

            print('status: ', data['status'])
            post.status = data['status']   
            post.save()  

            serializer = PostSerializer(post)

            return Response({ "post": serializer.data }, status=status.HTTP_200_OK)
        except Exception as e:
            print('error: ', e)
            Response({'error': "Error when editing post" }, status=status.HTTP_400_BAD_REQUEST)

class EditPostViewOld(APIView):
    permission_classes = (permissions.IsAdminUser, AuthorPermission, IsPostAuthorOrReadOnly)
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, format=None):
        data = self.request.data
        slug = data['slug']
        try:
            res = {}

            post = Post.objects.get(slug=slug)
            if data['title']:
                post.title = data['title']
                post.slug = data['new_slug']
                res = {
                    'new_slug': data['new_slug']
                }
                post.save()
            if data['description']:
                post.description = data['description']
                post.save()
            if data['thumbnail']:
                if post.thumbnail:
                    post.thumbnail.delete()
                post.thumbnail = data['thumbnail']
                post.save()
            if data['content']:
                post.content = data['content']
                post.save()
            if data['category']:
                c = Category.objects.get(id=int(data['category']))
                post.category = c
                post.save()
            if data['time_read']:
                if int(data['time_read']) != 0:
                    post.time_read = int(data['time_read'])
                    post.save()
            if data['status']:
                post.status = data['status']
                post.save()
            return Response(res, status=status.HTTP_200_OK)
        except:
            Response({'error'}, status=status.HTTP_400_BAD_REQUEST)
    
class DeletePostView(APIView):
    permission_classes=(permissions.IsAdminUser, AuthorPermission, IsPostAuthorOrReadOnly,)
    def delete(self, request, slug, format=None):
        if Post.objects.filter(slug=slug).exists():
            post = Post.objects.get(slug=slug)
            post.delete()
            return Response({'success': 'Post deleted'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No post found'}, status=status.HTTP_404_NOT_FOUND)
        
@csrf_exempt
def upload(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']
        fs = FileSystemStorage()
        filename = fs.save(image_file.name, image_file)
        image_url = fs.url(filename)
        # Realiza cualquier lógica adicional que necesites con la URL de la imagen
        return JsonResponse({'location': image_url})
    return HttpResponseBadRequest()