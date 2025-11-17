from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework import exceptions
from .models import MemberToken


class MemberTokenAuthentication(BaseAuthentication):
    keyword = b"token"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()
        if not auth:
            return None
        if len(auth) != 2:
            raise exceptions.AuthenticationFailed("Неверный заголовок авторизации")
        if auth[0].lower() != self.keyword:
            return None
        key = auth[1].decode()
        try:
            token = MemberToken.objects.select_related("member").get(key=key)
        except MemberToken.DoesNotExist:
            raise exceptions.AuthenticationFailed("Недействительный токен")
        return (token.member, token)
