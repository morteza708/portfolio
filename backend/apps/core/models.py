from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class Language(models.TextChoices):
    EN = "en", "English"
    FA = "fa", "Persian"


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Profile(TimestampedModel):
    language = models.CharField(max_length=2, choices=Language.choices, unique=True)
    full_name = models.CharField(max_length=120)
    title = models.CharField(max_length=200)
    tagline = models.TextField(blank=True)
    bio = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    location = models.CharField(max_length=120, blank=True)
    timezone = models.CharField(max_length=64, default="Asia/Tehran")
    availability_status = models.CharField(max_length=120, blank=True)
    hero_primary_cta = models.CharField(max_length=80, blank=True)
    hero_secondary_cta = models.CharField(max_length=80, blank=True)
    activity_summary_title = models.CharField(max_length=180, blank=True)
    activity_summary_text = models.TextField(blank=True)
    activity_summary_image = models.ImageField(upload_to="profiles/summary/", blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    avatar = models.ImageField(
        upload_to="profiles/",
        blank=True,
        verbose_name="About page photo",
        help_text="Profile photo shown on the About page (not the home Hero).",
    )
    about_highlights = models.JSONField(
        default=list,
        blank=True,
        help_text='List of {"title": "...", "description": "..."} focus cards for About.',
    )
    resume_file = models.FileField(upload_to="resumes/", blank=True)

    class Meta:
        verbose_name_plural = "profiles"

    def __str__(self):
        return f"{self.full_name} ({self.language})"


class Skill(TimestampedModel):
    language = models.CharField(max_length=2, choices=Language.choices)
    name = models.CharField(max_length=80)
    category = models.CharField(max_length=80, blank=True)
    proficiency = models.PositiveSmallIntegerField(default=80)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        unique_together = ["language", "name"]

    def __str__(self):
        return self.name


class Experience(TimestampedModel):
    language = models.CharField(max_length=2, choices=Language.choices)
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    location = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    company_url = models.URLField(blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-start_date", "order"]
        verbose_name_plural = "experiences"

    def __str__(self):
        return f"{self.role} @ {self.company}"


class Education(TimestampedModel):
    language = models.CharField(max_length=2, choices=Language.choices)
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200, blank=True)
    start_year = models.PositiveSmallIntegerField(null=True, blank=True)
    end_year = models.PositiveSmallIntegerField(null=True, blank=True)
    location = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-end_year", "order"]
        verbose_name_plural = "education entries"

    def __str__(self):
        return f"{self.degree} — {self.institution}"


class Certification(TimestampedModel):
    language = models.CharField(max_length=2, choices=Language.choices)
    name = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    issued_at = models.DateField(null=True, blank=True)
    credential_url = models.URLField(blank=True)
    skills = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-is_featured", "-issued_at", "order"]

    def __str__(self):
        return f"{self.name} ({self.issuer})"


class Project(TimestampedModel):
    language = models.CharField(max_length=2, choices=Language.choices)
    slug = models.SlugField(max_length=120)
    title = models.CharField(max_length=200)
    summary = models.TextField()
    description = CKEditor5Field("Description", config_name="article", blank=True)
    tech_stack = models.JSONField(default=list, blank=True)
    live_url = models.URLField(blank=True)
    repo_url = models.URLField(blank=True)
    cover_image = models.ImageField(upload_to="projects/", blank=True)
    cover_image_thumb = models.ImageField(upload_to="projects/thumbs/", blank=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)
    translation_group_id = models.UUIDField(null=True, blank=True)

    class Meta:
        ordering = ["order", "-created_at"]
        unique_together = ["language", "slug"]

    def __str__(self):
        return self.title


class Article(TimestampedModel):
    language = models.CharField(max_length=2, choices=Language.choices)
    slug = models.SlugField(max_length=120)
    title = models.CharField(max_length=200)
    excerpt = models.TextField()
    content = CKEditor5Field("Content", config_name="article")
    cover_image = models.ImageField(upload_to="articles/", blank=True)
    cover_image_thumb = models.ImageField(upload_to="articles/thumbs/", blank=True)
    tags = models.JSONField(default=list, blank=True)
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)
    translation_group_id = models.UUIDField(null=True, blank=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        unique_together = ["language", "slug"]

    def __str__(self):
        return self.title


class ContactMessage(TimestampedModel):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject or 'No subject'}"
