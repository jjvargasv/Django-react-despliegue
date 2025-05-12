from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.password_validation import validate_password

from .serializers import RegisterSerializer, CustomUserSerializer

User = get_user_model()

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def options(self, request, *args, **kwargs):
        response = super().options(request, *args, **kwargs)
        response['Access-Control-Allow-Origin'] = "https://tasmarkerjt.web.app"
        response['Access-Control-Allow-Methods'] = "POST, OPTIONS"
        response['Access-Control-Allow-Headers'] = "Content-Type, Authorization"
        response['Access-Control-Allow-Credentials'] = 'true'
        return response


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not user.check_password(old_password):
            return Response({'error': 'Contraseña actual incorrecta.'}, status=400)
        try:
            validate_password(new_password, user)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        user.set_password(new_password)
        user.save()
        return Response({'success': 'Contraseña actualizada correctamente.'})

class PasswordResetAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email requerido.'}, status=400)
        form = PasswordResetForm({'email': email})
        if form.is_valid():
            form.save(
                request=request,
                use_https=request.is_secure(),
                email_template_name='registration/password_reset_email.html',
                subject_template_name='registration/password_reset_subject.txt',
                from_email=settings.DEFAULT_FROM_EMAIL,
            )
            return Response({'success': 'Si el correo existe, se enviaron instrucciones.'})
        return Response({'error': 'No se pudo enviar el correo.'}, status=400)

class PasswordResetConfirmAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(pk=uid)
        except Exception:
            return Response({'error': 'Enlace inválido.'}, status=400)
        form = SetPasswordForm(user, request.data)
        if form.is_valid() and default_token_generator.check_token(user, token):
            form.save()
            return Response({'success': 'Contraseña restablecida.'})
        return Response({'error': 'No se pudo restablecer la contraseña.'}, status=400)
