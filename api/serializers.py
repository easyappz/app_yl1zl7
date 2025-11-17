from rest_framework import serializers
from .models import Member


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ("id", "name", "email", "phone", "created_at")


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_email(self, value):
        if Member.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email уже занят")
        return value

    def create(self, validated_data):
        member = Member(
            name=validated_data["name"],
            email=validated_data["email"],
            phone=validated_data.get("phone", ""),
        )
        member.set_password(validated_data["password"])
        member.save()
        return member


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ("name", "email", "phone")

    def validate_email(self, value):
        member = self.instance
        if Member.objects.filter(email__iexact=value).exclude(pk=member.pk).exists():
            raise serializers.ValidationError("Email уже занят")
        return value
