from rest_framework import serializers


class MediaPathField(serializers.FileField):
    """Return /media/... paths for the Next.js proxy (backend serves /django-media/)."""

    def to_representation(self, value):
        if not value:
            return None
        url = value.url
        if url.startswith("/django-media/"):
            return url.replace("/django-media/", "/media/", 1)
        return url
