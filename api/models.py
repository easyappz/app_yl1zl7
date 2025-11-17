from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
import secrets


class Member(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, blank=True)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(default=timezone.now)

    def set_password(self, raw_password: str) -> None:
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password)

    @property
    def is_authenticated(self) -> bool:
        return True

    def __str__(self) -> str:
        return self.email


class MemberToken(models.Model):
    key = models.CharField(max_length=40, unique=True)
    member = models.ForeignKey(Member, related_name="tokens", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def generate_key() -> str:
        return secrets.token_hex(20)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)
