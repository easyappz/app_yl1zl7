from django.contrib import admin
from .models import Member, MemberToken


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "name", "phone", "created_at")
    search_fields = ("email", "name", "phone")


@admin.register(MemberToken)
class MemberTokenAdmin(admin.ModelAdmin):
    list_display = ("key", "member", "created")
    search_fields = ("key", "member__email")
