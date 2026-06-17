from django.db import connection
from django.core.cache import cache
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .cache import api_cache_key, get_cached, set_cached, CACHE_TTL
from .mixins import CachedAPIViewMixin
from .models import Article, Certification, ContactMessage, Education, Experience, Profile, Project, Skill
from .serializers import (
    ArticleDetailSerializer,
    ArticleListSerializer,
    CertificationSerializer,
    ContactMessageSerializer,
    EducationSerializer,
    ExperienceSerializer,
    ProfileSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
    SkillSerializer,
)
from .throttles import ContactRateThrottle


class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        checks = {"api": "ok"}

        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            checks["database"] = "ok"
        except Exception:
            checks["database"] = "error"

        try:
            cache.set("health_check", "ok", timeout=5)
            checks["cache"] = "ok" if cache.get("health_check") == "ok" else "error"
        except Exception:
            checks["cache"] = "error"

        overall = "ok" if all(value == "ok" for value in checks.values()) else "degraded"
        status_code = status.HTTP_200_OK if overall == "ok" else status.HTTP_503_SERVICE_UNAVAILABLE

        return Response({"status": overall, "checks": checks}, status=status_code)


class ProfileDetailView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    authentication_classes = []
    permission_classes = []

    def get_object(self):
        language = self.kwargs["language"]
        return Profile.objects.filter(language=language).first()

    def retrieve(self, request, *args, **kwargs):
        language = self.kwargs["language"]
        cache_key = api_cache_key("profile", language)
        cached = get_cached(cache_key)
        if cached is not None:
            response = Response(cached)
            response["Cache-Control"] = f"public, max-age={CACHE_TTL}, s-maxage={CACHE_TTL}"
            return response

        instance = self.get_object()
        if instance is None:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance)
        set_cached(cache_key, serializer.data, CACHE_TTL)
        response = Response(serializer.data)
        response["Cache-Control"] = f"public, max-age={CACHE_TTL}, s-maxage={CACHE_TTL}"
        return response


class SkillListView(CachedAPIViewMixin, generics.ListAPIView):
    serializer_class = SkillSerializer
    authentication_classes = []
    permission_classes = []
    cache_namespace = "skills"

    def get_queryset(self):
        return Skill.objects.filter(language=self.kwargs["language"])


class ExperienceListView(CachedAPIViewMixin, generics.ListAPIView):
    serializer_class = ExperienceSerializer
    authentication_classes = []
    permission_classes = []
    cache_namespace = "experiences"

    def get_queryset(self):
        return Experience.objects.filter(language=self.kwargs["language"])


class EducationListView(CachedAPIViewMixin, generics.ListAPIView):
    serializer_class = EducationSerializer
    authentication_classes = []
    permission_classes = []
    cache_namespace = "education"

    def get_queryset(self):
        return Education.objects.filter(language=self.kwargs["language"])


class CertificationListView(CachedAPIViewMixin, generics.ListAPIView):
    serializer_class = CertificationSerializer
    authentication_classes = []
    permission_classes = []
    cache_namespace = "certifications"

    def get_queryset(self):
        return Certification.objects.filter(language=self.kwargs["language"])


class ProjectListView(CachedAPIViewMixin, generics.ListAPIView):
    serializer_class = ProjectListSerializer
    authentication_classes = []
    permission_classes = []
    cache_namespace = "projects"

    def get_queryset(self):
        return Project.objects.filter(
            language=self.kwargs["language"],
            is_published=True,
        )


class ProjectDetailView(CachedAPIViewMixin, generics.RetrieveAPIView):
    serializer_class = ProjectDetailSerializer
    authentication_classes = []
    permission_classes = []
    lookup_field = "slug"
    cache_namespace = "project"

    def get_queryset(self):
        return Project.objects.filter(
            language=self.kwargs["language"],
            is_published=True,
        )

    def get_cache_key(self) -> str:
        return api_cache_key(
            self.cache_namespace,
            self.kwargs["language"],
            self.kwargs["slug"],
        )


class ArticleListView(CachedAPIViewMixin, generics.ListAPIView):
    serializer_class = ArticleListSerializer
    authentication_classes = []
    permission_classes = []
    cache_namespace = "articles"

    def get_queryset(self):
        return Article.objects.filter(
            language=self.kwargs["language"],
            is_published=True,
        )


class ArticleDetailView(CachedAPIViewMixin, generics.RetrieveAPIView):
    serializer_class = ArticleDetailSerializer
    authentication_classes = []
    permission_classes = []
    lookup_field = "slug"
    cache_namespace = "article"

    def get_queryset(self):
        return Article.objects.filter(
            language=self.kwargs["language"],
            is_published=True,
        )

    def get_cache_key(self) -> str:
        return api_cache_key(
            self.cache_namespace,
            self.kwargs["language"],
            self.kwargs["slug"],
        )


class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    authentication_classes = []
    permission_classes = []
    throttle_classes = [ContactRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"detail": "Message received successfully."},
            status=status.HTTP_201_CREATED,
        )
