# Generated manually for initial setup

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ContactMessage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=120)),
                ("email", models.EmailField(max_length=254)),
                ("subject", models.CharField(blank=True, max_length=200)),
                ("message", models.TextField()),
                ("is_read", models.BooleanField(default=False)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="Profile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "language",
                    models.CharField(
                        choices=[("en", "English"), ("fa", "Persian")],
                        max_length=2,
                        unique=True,
                    ),
                ),
                ("full_name", models.CharField(max_length=120)),
                ("title", models.CharField(max_length=200)),
                ("tagline", models.TextField(blank=True)),
                ("bio", models.TextField(blank=True)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("location", models.CharField(blank=True, max_length=120)),
                ("timezone", models.CharField(default="Asia/Tehran", max_length=64)),
                ("availability_status", models.CharField(blank=True, max_length=120)),
                ("github_url", models.URLField(blank=True)),
                ("linkedin_url", models.URLField(blank=True)),
                ("resume_file", models.FileField(blank=True, upload_to="resumes/")),
            ],
            options={
                "verbose_name_plural": "profiles",
            },
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "language",
                    models.CharField(
                        choices=[("en", "English"), ("fa", "Persian")],
                        max_length=2,
                    ),
                ),
                ("slug", models.SlugField(max_length=120)),
                ("title", models.CharField(max_length=200)),
                ("summary", models.TextField()),
                ("description", models.TextField(blank=True)),
                ("tech_stack", models.JSONField(blank=True, default=list)),
                ("live_url", models.URLField(blank=True)),
                ("repo_url", models.URLField(blank=True)),
                ("cover_image", models.ImageField(blank=True, upload_to="projects/")),
                ("is_featured", models.BooleanField(default=False)),
                ("is_published", models.BooleanField(default=True)),
                ("order", models.PositiveSmallIntegerField(default=0)),
                ("translation_group_id", models.UUIDField(blank=True, null=True)),
            ],
            options={
                "ordering": ["order", "-created_at"],
                "unique_together": {("language", "slug")},
            },
        ),
        migrations.CreateModel(
            name="Skill",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "language",
                    models.CharField(
                        choices=[("en", "English"), ("fa", "Persian")],
                        max_length=2,
                    ),
                ),
                ("name", models.CharField(max_length=80)),
                ("category", models.CharField(blank=True, max_length=80)),
                ("proficiency", models.PositiveSmallIntegerField(default=80)),
                ("order", models.PositiveSmallIntegerField(default=0)),
            ],
            options={
                "ordering": ["order", "name"],
                "unique_together": {("language", "name")},
            },
        ),
    ]
