import os
import sys
import django

# Configura la ruta a tu proyecto Django (ajústala según tu estructura)
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")  # Cambia "myproject" al nombre de tu proyecto

# Inicializa Django
django.setup()
import environ
from django.contrib.auth import get_user_model
import random
from apps.portfolio.models import Project
from apps.category.models import Category
from apps.blog.models import Post
from PIL import Image
from io import BytesIO
from django.core.files import File
from django.conf import settings

env = environ.Env()
environ.Env.read_env()

User = get_user_model()

class CreateDB():

    def createSuperUser():
        print("Starting create superuser")

        username = env("SUPER_USERNAME")
        email = env("SUPER_EMAIL")
        password = env("SUPER_PASSWORD")
        if not User.objects.filter(username=username).exists():
            client_user = User.objects.create_superuser(
                username=username,
                email=email,
                is_active=True,
            )
            client_user.set_password(password)
            client_user.save()
        else:
            client_user = User.objects.get(username=username)

        print("Superuser created successfully")

        return client_user
    
    def createProjects(user):
        print("Starting create projects")
        def getContent(title, url):
            return f"<div class='flex column box-xxl margin-center gap-s margin-t-s third-color' ><h1>{title}<h1><h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum molestie laoreet eros, eget pharetra enim vestibulum non. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque suscipit, justo ut feugiat tristique, nisi purus ultrices augue, at rhoncus elit urna vitae velit. Aliquam vitae ante convallis, consectetur diam vitae, egestas dolor. Nulla facilisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus laoreet justo, et tincidunt odio semper ut. Morbi faucibus vel diam ut efficitur. Aliquam vel hendrerit erat.</h4> <img class='box-xxl f-height-m fit-contain' src='{url}' alt='sampleProjectImage' /> </div>"
        
        for index in range(1, 5, 1):
            print('index: ', index)
            for projectIndex in range(1, 10, 1):
                print('projectIndex: ', projectIndex)
                title = f"sp-{index} Sample project-{projectIndex}"
                slug = f"sp-{index}-sample-project-{projectIndex}"
                description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum molestie laoreet eros, eget pharetra enim vestibulum non. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
                
                views = random.randint(1, 100)
                category = f"sp-{index}"
                status = random.choice(['pre_production', 'production', 'constant_updates', 'finished'])
                if not Project.objects.filter(slug=slug).exists():
                    project = Project.objects.create(
                        title=title,
                        slug=slug,
                        author=user,
                        description=description,
                        views=views,
                        category=category,
                        status=status,
                    )
                    red = random.randint(0, 255)
                    green = random.randint(0, 255)
                    blue = random.randint(0, 255)
                    width, height = Image.open(
                        "static-dpw/static/img/sampleProjectImage.jpeg").size
                    solid_color_image = Image.new(
                        "RGB", (width, height), (red, green, blue))                    
                    with open("static-dpw/static/img/sampleProjectImage.jpeg", "rb") as img_file:
                        original_image = Image.open(img_file)
                        blended_image = Image.blend(
                            original_image, solid_color_image, alpha=0.5)
                        buffer = BytesIO()
                        blended_image.save(buffer, format="JPEG")
                        project.thumbnail.save(
                        "sampleProjectImage_with_mask.jpeg", File(buffer))

                    content = getContent(title, f"{project.thumbnail.url}")
                    project.content = content
                    project.save()

        print("Projects created successfully")
    
    def createCategories():
        print("Starting create categories")

        categories = []

        for index in range(1, 5, 1):
            print('index: ', index)
            name = f"{index} Sample category"
            slug = f"{index}-sample-category"

            views = random.randint(1, 100)
            if not Category.objects.filter(slug=slug).exists():            
                category = Category.objects.create(
                    name=name,
                    slug=slug,
                    views=views
                )
                categories.append(category)

        print("Categories created successfully")

        return categories

    def createPosts(categories, user):
        print("Starting create posts")
        def getContent(title, url):
            return f"<div class='flex column box-xxl margin-center gap-s margin-t-s third-color'> <h1>{title}<h1> <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum molestie laoreet eros, eget pharetra enim vestibulum non. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque suscipit, justo ut feugiat tristique, nisi purus ultrices augue, at rhoncus elit urna vitae velit. Aliquam vitae ante convallis, consectetur diam vitae, egestas dolor. Nulla facilisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus laoreet justo, et tincidunt odio semper ut. Morbi faucibus vel diam ut efficitur. Aliquam vel hendrerit erat.</h4> <img class='box-xxl f-height-m fit-contain' src='{url}' alt='sampleProjectImage' /> </div>"

        for c in categories:
            for index in range(1, 12, 1):
                title = f"cb-{c.name[0:2]} Sample post-{index}"
                slug = f"cb-{c.slug[0:2]}-sample-post-{index}"
                print('slug: ', slug)
                description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum molestie laoreet eros, eget pharetra enim vestibulum non. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
                status = "published"
                time_read = random.randint(1, 15)
                views = random.randint(1, 100)
                if not Post.objects.filter(slug=slug).exists():  
                    post = Post.objects.create(
                        title=title,
                        slug=slug,
                        author=user,
                        description=description,
                        status=status,
                        time_read=time_read,
                        views=views,
                        category=c,
                    )
                    red = random.randint(0, 255)
                    green = random.randint(0, 255)
                    blue = random.randint(0, 255)
                    width, height = Image.open(
                        "static-dpw/static/img/samplePostImage.jpeg").size
                    solid_color_image = Image.new(
                        "RGB", (width, height), (red, green, blue))                    
                    with open("static-dpw/static/img/samplePostImage.jpeg", "rb") as img_file:
                        original_image = Image.open(img_file)
                        blended_image = Image.blend(
                            original_image, solid_color_image, alpha=0.5)
                        buffer = BytesIO()
                        blended_image.save(buffer, format="JPEG")
                        post.thumbnail.save(
                        "samplePostImage_with_mask.jpeg", File(buffer))

                    content = getContent(title, f"{post.thumbnail.url}")
                    post.content = content
                    post.save()

        print("Posts created successfully")
        
    try:
        user = createSuperUser()
        createProjects(user)
        categories = createCategories()
        createPosts(categories, user)
    except Exception as e:
        print('Error: ', e)

if __name__ == '__main__':
    CreateDB()