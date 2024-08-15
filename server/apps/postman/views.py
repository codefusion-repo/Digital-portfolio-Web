from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import permissions
from mailjet_rest import Client
import os

# Create your views here.

class sendContactEmail(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self ,request, format=None):
        data = self.request.data
        api_key = os.environ.get('MAILJET_API_KEY')
        api_secret = os.environ.get('MAILJET_SECRET_KEY')
        mailjet = Client(auth=(api_key, api_secret), version='v3.1')
        body = ''
        if data['mobile_number']:
                body = f"Número de celular: {data['mobile_number']} <br> Copia del Mensaje: {data['message']}"
        else:
                body = f"Copia del Mensaje: {data['message']}"
        from_email = os.environ.get('EMAIL_HOST_USER')
        current_email = data['email']
        subject = "Example contact e-mail - Digital portfolio Web"
        data = {
                'Messages': [{
                    "From": {
                        "Email": from_email,
                        "Name":"Digital portfolio Web"
                    },
                    "To": [{
                       "Email": current_email,
                       "Name": "You"
                    },
                    {
                        "Email": from_email,
                        "Name":"Copy email"
                    }],
			       "TemplateID": 6175543,
			       "TemplateLanguage": True,
			       "Subject": subject,
			       "Variables": {"email":current_email, 'subject':subject, 'body':body}
                }]
               }
        result = mailjet.send.create(data=data)

        print(result.status_code)

        print(result.json())

        if result.status_code == 200:
                return Response({'success': 'Email sended'}, status=status.HTTP_200_OK)
        else:
                return Response({'error': 'Email not sended'}, status=status.HTTP_400_BAD_REQUEST)
