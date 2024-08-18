from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from djoser.utils import encode_uid, decode_uid
from rest_framework.response import Response
from rest_framework import status
from django.urls import reverse
import os
from mailjet_rest import Client
from rest_framework.views import APIView
from rest_framework import permissions
from django.urls import reverse
from djoser import utils
from datetime import datetime, timedelta
from django.utils import timezone
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model

User = get_user_model(

)
class Login(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        data = self.request.data
        username = data['username']
        password = data['password']

        user = User.objects.filter(username=username).first()
        if user is None or not user.check_password(password):
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class send_password_reset_email(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        data = self.request.data
        email = data['email']

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
        else:
            return  Response({'detail': 'El usuario no existe.'}, status=status.HTTP_400_BAD_REQUEST)        
        
        # Genera el token de restablecimiento de contraseña
        token = default_token_generator.make_token(user)
        
        # Decodifica el UID del usuario para incluirlo en el enlace de restablecimiento de contraseña
        uid = encode_uid(user.pk)
        
        # Construye la URL para el enlace de restablecimiento de contraseña
        reset_url = f'http://localhost:3000/password/reset/confirm'
        reset_url = reset_url + f'/{uid}/{token}'
        reset_url = request.build_absolute_uri(reset_url)

        user.token = token
        current_time = datetime.now()
        expiration_time = current_time + timedelta(days=2)
        user.token_expire = expiration_time
        user.save()
        
        # Envía el correo electrónico de restablecimiento de contraseña
        api_key = os.environ.get('MJ_APIKEY_PUBLIC')
        api_secret = os.environ.get('MJ_APIKEY_PRIVATE')
        mailjet = Client(auth=(api_key, api_secret), version='v3.1')
        subject = 'Password recovery - Digital portfolio Web'
        from_email = os.environ.get('EMAIL_HOST_USER')
        current_email = user.email
        data = {
            'Messages': [
                {
                "From": {
                    "Email": from_email,
                    "Name": "Digital portfolio Web"
                },
                "To": [
                    {
                    "Email": current_email,
                    "Name": "You"
                    }
                ],
                    "TemplateID": 6173509,
                    "TemplateLanguage": True,
                    "Subject": subject,
                    "Variables": {'mj_confirmation_link': reset_url}
                }
            ]
        }
        result = mailjet.send.create(data=data)

        print(result.status_code)

        print(result.json())

        if result.status_code == 200:
            return Response({'success': 'Email sended'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Email not sended'}, status=status.HTTP_400_BAD_REQUEST)

class CustomPasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        data = self.request.data

        print('data:', data)

        # Obtiene el UID y el token de los parámetros de la solicitud
        uid = data['uid']
        token = data['token']
        
        # Decodifica el UID del usuario
        try:
            user_id = decode_uid(uid)
            # Obtiene el usuario correspondiente al UID

            if User.objects.filter(pk=user_id).exists():
                user = User.objects.get(pk=user_id)
            else:
                return  Response({'detail': 'El usuario no existe.'}, status=status.HTTP_400_BAD_REQUEST)
            # Maneja el caso si el usuario no existe
        
            if token != user.token:
                return  Response({'detail': 'Token de restablecimiento no valido.'}, status=status.HTTP_400_BAD_REQUEST)

            # Verifica si el token de restablecimiento de contraseña es válido
            if user.token_expire < timezone.now():
                # Maneja el caso si el token no es válido
                user.token = ''
                user.token_expire = None
                user.save()
                return  Response({'detail': 'Token de restablecimiento no valido.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Procesa el restablecimiento de contraseña utilizando el formulario predeterminado
            user.set_password(data['new_password'])

            user.token = ''
            user.token_expire = None
            user.save()
        except Exception as e:
            print("err: ", e)
        
        # Redirige a la página de restablecimiento de contraseña exitoso
        return Response({'detail': 'Contraseña restablecida.'}, status=status.HTTP_200_OK)