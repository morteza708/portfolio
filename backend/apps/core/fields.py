from rest_framework import serializers


class MediaPathField(serializers.FileField):
    """Return /media/... paths — safe for browser and Next.js proxy."""

    def to_representation(self, value):
        if not value:
            return None
        return value.url
