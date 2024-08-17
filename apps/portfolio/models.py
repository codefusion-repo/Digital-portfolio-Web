from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from apps.category.models import Category
from django.utils import timezone
from apps.user.models import UserAccount
from tinymce.models import HTMLField
import uuid

def project_thumbnail_directory(instance, filename):
    return 'project/{0}/{1}'.format(instance.slug, filename)

class Project(models.Model):
    class ProjectObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(status__in=('pre_production', 'production', 'constant_updates', 'finished'))
    options = {
        ('drafted', 'Drafted'),
        ('pre_production', 'Pre_production'),
        ('production', 'Production'),
        ('constant_updates', 'Constant_updates'),
        ('finished', 'Finished'),
    }
    categories = {
        ('sp-1', 'Sample category 1'),
        ('sp-2', 'Sample category 2'),
        ('sp-3', 'Sample category 3'),
        ('sp-4', 'Sample category 4'),
    }
    id = models.CharField(max_length=300, primary_key=True, unique=True, default=uuid.uuid4, editable=False)

    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    thumbnail = models.ImageField(upload_to=project_thumbnail_directory, max_length=1000)

    author = models.ForeignKey(UserAccount, on_delete=models.CASCADE)

    description = models.TextField(max_length=255)
    content = HTMLField()
    published = models.DateTimeField(default=timezone.now)
    views = models.IntegerField(default=0, blank=True)
    category = models.CharField(max_length=25, choices=categories, default='sp-1')

    status = models.CharField(max_length=25, choices=options, default='drafted')
    
    objects = models.Manager()
    projectobjects = ProjectObjects()

    class Meta:
        ordering = ('-published',)

    def __str__(self):
        return self.title
    
    def get_view_count(self):
        views = ViewCount.objects.filter(post=self).count()
        return views

class ViewCount(models.Model):
    project = models.ForeignKey(Project, related_name='project_view_count', on_delete=models.CASCADE)
    ip_address = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.ip_address}'
