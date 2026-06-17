from .base import *  # noqa: F403

DEBUG = True

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"].append(  # noqa: F405
    "rest_framework.renderers.BrowsableAPIRenderer"
)

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
