from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

urlpatterns = [
    path("admin/", admin.site.urls),
    path("ckeditor5/", include("django_ckeditor_5.urls")),
    path("api/v1/", include("apps.core.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    media_prefix = settings.MEDIA_URL.lstrip("/")
    static_prefix = settings.STATIC_URL.lstrip("/")
    urlpatterns += [
        re_path(
            rf"^{static_prefix}(?P<path>.*)$",
            serve,
            {"document_root": settings.STATIC_ROOT},
        ),
        re_path(
            rf"^{media_prefix}(?P<path>.*)$",
            serve,
            {"document_root": settings.MEDIA_ROOT},
        ),
    ]
