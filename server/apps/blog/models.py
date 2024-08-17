from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from apps.category.models import Category
from django.utils import timezone
from apps.user.models import UserAccount
from tinymce.models import HTMLField
import uuid

def blog_thumbnail_directory(instance, filename):
    return 'blog/{0}/{1}'.format(instance.slug, filename)

class Post(models.Model):
    class PostObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(status='published')
        
    options = {
        ('draft', 'Draft'),
        ('published', 'Published'),
    }
    id = models.CharField(max_length=300, primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    thumbnail = models.ImageField(upload_to=blog_thumbnail_directory, max_length=1000)

    author = models.ForeignKey(UserAccount, on_delete=models.CASCADE)

    description = models.TextField(max_length=255)
    content = HTMLField()
    time_read = models.IntegerField()
    published = models.DateTimeField(default=timezone.now)
    views = models.IntegerField(default=0, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    status = models.CharField(max_length=15, choices=options, default='draft')
    
    objects = models.Manager()
    postobjects = PostObjects()

    class Meta:
        ordering = ('-published',)

    def __str__(self):
        return self.title
    
    def get_view_count(self):
        views = ViewCount.objects.filter(post=self).count()
        return views
    
class ViewCount(models.Model):
    post = models.ForeignKey(Post, related_name='post_view_count', on_delete=models.CASCADE)
    ip_address = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.ip_address}'

