from django.urls import path, register_converter

from .views import (
    ArticleDetailView,
    ArticleListView,
    CertificationListView,
    ContactCreateView,
    EducationListView,
    ExperienceListView,
    HealthCheckView,
    ProfileDetailView,
    ProjectDetailView,
    ProjectListView,
    SkillListView,
)


class LanguageConverter:
    regex = "en|fa"

    def to_python(self, value):
        return value

    def to_url(self, value):
        return value


register_converter(LanguageConverter, "lang")

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("<lang:language>/profile/", ProfileDetailView.as_view(), name="profile-detail"),
    path("<lang:language>/skills/", SkillListView.as_view(), name="skill-list"),
    path("<lang:language>/experiences/", ExperienceListView.as_view(), name="experience-list"),
    path("<lang:language>/education/", EducationListView.as_view(), name="education-list"),
    path("<lang:language>/certifications/", CertificationListView.as_view(), name="certification-list"),
    path("<lang:language>/projects/", ProjectListView.as_view(), name="project-list"),
    path(
        "<lang:language>/projects/<slug:slug>/",
        ProjectDetailView.as_view(),
        name="project-detail",
    ),
    path("<lang:language>/articles/", ArticleListView.as_view(), name="article-list"),
    path(
        "<lang:language>/articles/<slug:slug>/",
        ArticleDetailView.as_view(),
        name="article-detail",
    ),
    path("contact/", ContactCreateView.as_view(), name="contact-create"),
]
