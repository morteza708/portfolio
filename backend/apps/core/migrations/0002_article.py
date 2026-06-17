from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Article",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("language", models.CharField(choices=[("en", "English"), ("fa", "Persian")], max_length=2)),
                ("slug", models.SlugField(max_length=120)),
                ("title", models.CharField(max_length=200)),
                ("excerpt", models.TextField()),
                ("content", models.TextField()),
                ("cover_image", models.ImageField(blank=True, upload_to="articles/")),
                ("tags", models.JSONField(blank=True, default=list)),
                ("meta_title", models.CharField(blank=True, max_length=70)),
                ("meta_description", models.CharField(blank=True, max_length=160)),
                ("is_published", models.BooleanField(default=True)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                ("translation_group_id", models.UUIDField(blank=True, null=True)),
            ],
            options={
                "ordering": ["-published_at", "-created_at"],
                "unique_together": {("language", "slug")},
            },
        ),
    ]
