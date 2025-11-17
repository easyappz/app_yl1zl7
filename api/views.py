from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from .serializers import (
    MessageSerializer,
    RegisterSerializer,
    LoginSerializer,
    MemberSerializer,
    ProfileUpdateSerializer,
)
from .models import Member, MemberToken
from .auth import MemberTokenAuthentication


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            token = MemberToken.objects.create(member=member)
            return Response({"token": token.key, "member": MemberSerializer(member).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        try:
            member = Member.objects.get(email__iexact=email)
        except Member.DoesNotExist:
            return Response({"detail": "Неверный email или пароль"}, status=status.HTTP_400_BAD_REQUEST)
        if not member.check_password(password):
            return Response({"detail": "Неверный email или пароль"}, status=status.HTTP_400_BAD_REQUEST)
        token = MemberToken.objects.create(member=member)
        return Response({"token": token.key, "member": MemberSerializer(member).data})


class LogoutView(APIView):
    authentication_classes = [MemberTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        token = request.auth
        if token:
            token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    authentication_classes = [MemberTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(MemberSerializer(request.user).data)

    def put(self, request):
        serializer = ProfileUpdateSerializer(instance=request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(MemberSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
