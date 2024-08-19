from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
# Create your views here.
from .serializers import ProjectsListSerializer, ProjectSerializer
from .permissions import IsPostAuthorOrReadOnly, AuthorPermission
from .models import Project, ViewCount
from .pagination import SmallSetPagination, MediumSetPagination, LargeSetPagination
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import IntegrityError
from slugify import slugify

class PortfolioListView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, format=None):
        if Project.projectobjects.all().exists():
            projects = Project.projectobjects.all()
            paginator = SmallSetPagination()
            results = paginator.paginate_queryset(projects, request)
            serializer = ProjectsListSerializer(projects, many=True)
            return Response({'projects': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No projects found'}, status=status.HTTP_404_NOT_FOUND)
        
class PortfolioFilterView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        try:
            data = self.request.data
            category = data['category']
            s = data['status']
            if Project.projectobjects.all().exists():
                if category == 'all' and s == 'all':
                    projects = Project.projectobjects.all()
                else:
                    if category != 'all':
                       projects = Project.projectobjects.filter(category=category)
                    if s != 'all':
                       projects = Project.projectobjects.filter(status=s)
                    if category != 'all' and s != 'all':
                       projects = Project.projectobjects.filter(category=category, status=s)
            else:
                return Response({'error': 'No projects found'}, status=status.HTTP_404_NOT_FOUND)

            paginator = SmallSetPagination()
            results = paginator.paginate_queryset(projects, request)
            serializer = ProjectsListSerializer(projects, many=True)
            return Response({'projects': serializer.data}, status=status.HTTP_200_OK)
            return paginator.get_paginated_response({'projects': serializer.data})
                
        except Exception as e:
            print('err:', e)
            return Response({'error': 'No projects found'}, status=status.HTTP_404_NOT_FOUND)


class PortfolioDetailView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, slug, format=None):
        if Project.objects.filter(slug=slug).exists():
            project = Project.objects.get(slug=slug)
            serializer = ProjectSerializer(project)

            address = request.META.get('HTTP_X_FORWARDED_FOR')
            if address:
                ip = address.split(',')[-1].strip()
            else:
                ip = request.META.get('REMOTE_ADDR')

            if not ViewCount.objects.filter(project=project, ip_address=ip):
                view = ViewCount(project=project, ip_address=ip)
                view.save()
                project.views += 1
                project.save()

            return Response({'project': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No project found'}, status=status.HTTP_404_NOT_FOUND)

class AuthorProjectListView(APIView):
    permission_classes = (permissions.IsAdminUser, IsPostAuthorOrReadOnly,)
    def get(self, request, format=None):
        user = self.request.user
        if Project.objects.filter(author=user.id).exists():   
            projects = Project.objects.filter(author=user.id)

            paginator = SmallSetPagination()
            results = paginator.paginate_queryset(projects, request)
            serializer = ProjectsListSerializer(projects, many=True)
            return Response({'author_projects': serializer.data}, status=status.HTTP_200_OK)
            return paginator.get_paginated_response({'author_projects': serializer.data})
        else:
            return Response({'error':'Projects do not exist'}, status=status.HTTP_404_NOT_FOUND)

class CreateProjectView(APIView):
    permission_classes = (permissions.IsAdminUser, AuthorPermission,)
    def post(self, request, format=None):
        data = self.request.data
        try:
            Project.objects.create(
                title=data['title'],
                slug=data['slug'],
                thumbnail=data['thumbnail'],
                author=self.request.user,
                description=data['description'],
                content=data['content'],
                category=data['category'],
                status=data['status'],
            )  
            return Response({'success': 'Proyecto creado.'}, status=status.HTTP_200_OK)
        except IntegrityError as error:
            mensaje = f"An error occurred: {error}"
            mensaje_humanizado = ' '.join(word.capitalize() for word in str(mensaje).split('_'))
            print('mensaje:'+mensaje_humanizado)
            return Response({'error': mensaje_humanizado}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as error:
            mensaje = f"An error occurred: {error}"
            mensaje_humanizado = ' '.join(word.capitalize() for word in str(mensaje).split('_'))
            print('mensaje:'+mensaje_humanizado)
            return Response({'error': mensaje_humanizado}, status=status.HTTP_400_BAD_REQUEST)

class EditProjectView(APIView):
    permission_classes = (permissions.IsAdminUser, AuthorPermission, IsPostAuthorOrReadOnly)
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, format=None):
        data = self.request.data

        if Project.objects.filter(id=data['id']):
            project = Project.objects.get(id=data['id'])
        else:
            return Response({ 'error': 'Post no found' }, status=status.HTTP_404_NOT_FOUND)
        try:
            if not Project.objects.filter(title=data['title']).exists():
                if project.title != data['title']:
                    project.title = data['title']
                    project.slug = slugify(data['title'])

            project.description = data['description']

            print('thumbnail: ', data['thumbnail'])
            if data['thumbnail']:
                project.thumbnail = data['thumbnail']
                
            project.content = data['content']
            project.category = data['category']

            print('status: ', data['status'])
            project.status = data['status']   
            project.save()  

            serializer = ProjectSerializer(project)

            return Response({ "project": serializer.data }, status=status.HTTP_200_OK)
        except Exception as e:
            print('error: ', e)
            Response({'error': "Error when editing project" }, status=status.HTTP_400_BAD_REQUEST)

class EditProjectViewOld(APIView):
    permission_classes = (permissions.IsAdminUser, AuthorPermission, IsPostAuthorOrReadOnly)
    parser_classes = [MultiPartParser, FormParser]
    def put(self, request, format=None):
        data = self.request.data
        slug = data['slug']
        
        try:
            res = {}
            project = Project.objects.get(slug=slug)
            if data['title']:
                project.title = data['title']
                project.slug = data['new_slug']
                res = {
                    'new_slug': data['new_slug']
                }
                project.save()
            if data['description']:
                project.description = data['description']
                project.save()
            if data['thumbnail']:
                if project.thumbnail:
                    project.thumbnail.delete()
                project.thumbnail = data['thumbnail']
                project.save()
            if data['content']:
                project.content = data['content']
                project.save()
            if data['category']:
                project.category = data['category']
                project.save()
            if data['status']:
                project.status = data['status']
                project.save()
            return Response(res, status=status.HTTP_200_OK)
        except:
            Response({'error'}, status=status.HTTP_400_BAD_REQUEST)

class DeleteProjectView(APIView):
    permission_classes=(permissions.IsAdminUser, AuthorPermission, IsPostAuthorOrReadOnly,)
    def delete(self, request, slug, format=None):
        if Project.objects.filter(slug=slug).exists():
            project = Project.objects.get(slug=slug)
            project.delete()
            return Response({'success': 'Project deleted'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Project no found'}, status=status.HTTP_404_NOT_FOUND)
        
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