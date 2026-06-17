import json
import os
import urllib.error
import urllib.request

from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone

from .cache import (
    invalidate_articles,
    invalidate_certifications,
    invalidate_education,
    invalidate_experiences,
    invalidate_profile,
    invalidate_projects,
    invalidate_skills,
)
from .models import Article, Certification, Education, Experience, Profile, Project, Skill
from .services.images import optimize_cover_images


def _frontend_revalidate_tags(tags: list[str]) -> None:
    url = os.environ.get("FRONTEND_REVALIDATE_URL", "").strip()
    secret = os.environ.get("REVALIDATION_SECRET", "").strip()

    if not url or not secret or not tags:
        return

    payload = json.dumps({"secret": secret, "tags": tags}).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "x-revalidation-secret": secret,
        },
        method="POST",
    )

    try:
        urllib.request.urlopen(request, timeout=5)
    except (urllib.error.URLError, TimeoutError):
        return


def _remember_cover_name(instance, field_name: str, attr_name: str) -> None:
    if instance.pk:
        previous = (
            instance.__class__.objects.filter(pk=instance.pk)
            .values_list(field_name, flat=True)
            .first()
        )
        setattr(instance, attr_name, previous or "")
    else:
        setattr(instance, attr_name, "")


@receiver(pre_save, sender=Project)
def remember_project_cover(sender, instance, **kwargs):
    _remember_cover_name(instance, "cover_image", "_previous_cover_image")


@receiver(pre_save, sender=Article)
def remember_article_cover(sender, instance, **kwargs):
    _remember_cover_name(instance, "cover_image", "_previous_cover_image")


@receiver(pre_save, sender=Article)
def set_article_published_at(sender, instance, **kwargs):
    if instance.is_published and not instance.published_at:
        instance.published_at = timezone.now()


@receiver(post_save, sender=Profile)
def profile_saved(sender, instance, **kwargs):
    invalidate_profile(instance.language)
    _frontend_revalidate_tags([f"profile-{instance.language}"])


@receiver(post_save, sender=Skill)
def skill_saved(sender, instance, **kwargs):
    invalidate_skills(instance.language)
    _frontend_revalidate_tags([f"skills-{instance.language}"])


@receiver(post_delete, sender=Skill)
def skill_deleted(sender, instance, **kwargs):
    invalidate_skills(instance.language)
    _frontend_revalidate_tags([f"skills-{instance.language}"])


@receiver(post_save, sender=Experience)
def experience_saved(sender, instance, **kwargs):
    invalidate_experiences(instance.language)
    _frontend_revalidate_tags([f"experiences-{instance.language}", f"profile-{instance.language}"])


@receiver(post_delete, sender=Experience)
def experience_deleted(sender, instance, **kwargs):
    invalidate_experiences(instance.language)
    _frontend_revalidate_tags([f"experiences-{instance.language}", f"profile-{instance.language}"])


@receiver(post_save, sender=Education)
def education_saved(sender, instance, **kwargs):
    invalidate_education(instance.language)
    _frontend_revalidate_tags([f"education-{instance.language}", f"profile-{instance.language}"])


@receiver(post_delete, sender=Education)
def education_deleted(sender, instance, **kwargs):
    invalidate_education(instance.language)
    _frontend_revalidate_tags([f"education-{instance.language}", f"profile-{instance.language}"])


@receiver(post_save, sender=Certification)
def certification_saved(sender, instance, **kwargs):
    invalidate_certifications(instance.language)
    _frontend_revalidate_tags([f"certifications-{instance.language}", f"profile-{instance.language}"])


@receiver(post_delete, sender=Certification)
def certification_deleted(sender, instance, **kwargs):
    invalidate_certifications(instance.language)
    _frontend_revalidate_tags([f"certifications-{instance.language}", f"profile-{instance.language}"])


@receiver(post_save, sender=Project)
def project_saved(sender, instance, created, **kwargs):
    invalidate_projects(instance.language, instance.slug)
    _frontend_revalidate_tags(
        [
            f"projects-{instance.language}",
            f"project-{instance.language}-{instance.slug}",
        ]
    )

    current_cover = instance.cover_image.name if instance.cover_image else ""
    previous_cover = getattr(instance, "_previous_cover_image", "")
    if current_cover != previous_cover:
        optimize_cover_images(instance)


@receiver(post_delete, sender=Project)
def project_deleted(sender, instance, **kwargs):
    invalidate_projects(instance.language, instance.slug)
    _frontend_revalidate_tags(
        [
            f"projects-{instance.language}",
            f"project-{instance.language}-{instance.slug}",
        ]
    )


@receiver(post_save, sender=Article)
def article_saved(sender, instance, created, **kwargs):
    invalidate_articles(instance.language, instance.slug)
    _frontend_revalidate_tags(
        [
            f"articles-{instance.language}",
            f"article-{instance.language}-{instance.slug}",
        ]
    )

    current_cover = instance.cover_image.name if instance.cover_image else ""
    previous_cover = getattr(instance, "_previous_cover_image", "")
    if current_cover != previous_cover:
        optimize_cover_images(instance)


@receiver(post_delete, sender=Article)
def article_deleted(sender, instance, **kwargs):
    invalidate_articles(instance.language, instance.slug)
    _frontend_revalidate_tags(
        [
            f"articles-{instance.language}",
            f"article-{instance.language}-{instance.slug}",
        ]
    )
