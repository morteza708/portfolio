from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0007_profile_home_sections"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="about_highlights",
            field=models.JSONField(
                blank=True,
                default=list,
                help_text='List of {"title": "...", "description": "..."} focus cards for About.',
            ),
        ),
        migrations.AlterField(
            model_name="profile",
            name="avatar",
            field=models.ImageField(
                blank=True,
                help_text="Profile photo shown on the About page (not the home Hero).",
                upload_to="profiles/",
                verbose_name="About page photo",
            ),
        ),
        migrations.CreateModel(
            name="Experience",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("language", models.CharField(choices=[("en", "English"), ("fa", "Persian")], max_length=2)),
                ("company", models.CharField(max_length=200)),
                ("role", models.CharField(max_length=200)),
                ("location", models.CharField(blank=True, max_length=120)),
                ("description", models.TextField(blank=True)),
                ("start_date", models.DateField()),
                ("end_date", models.DateField(blank=True, null=True)),
                ("is_current", models.BooleanField(default=False)),
                ("company_url", models.URLField(blank=True)),
                ("order", models.PositiveSmallIntegerField(default=0)),
            ],
            options={
                "verbose_name_plural": "experiences",
                "ordering": ["-start_date", "order"],
            },
        ),
        migrations.CreateModel(
            name="Education",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("language", models.CharField(choices=[("en", "English"), ("fa", "Persian")], max_length=2)),
                ("institution", models.CharField(max_length=200)),
                ("degree", models.CharField(max_length=200)),
                ("field_of_study", models.CharField(blank=True, max_length=200)),
                ("start_year", models.PositiveSmallIntegerField(blank=True, null=True)),
                ("end_year", models.PositiveSmallIntegerField(blank=True, null=True)),
                ("location", models.CharField(blank=True, max_length=120)),
                ("description", models.TextField(blank=True)),
                ("order", models.PositiveSmallIntegerField(default=0)),
            ],
            options={
                "verbose_name_plural": "education entries",
                "ordering": ["-end_year", "order"],
            },
        ),
        migrations.CreateModel(
            name="Certification",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("language", models.CharField(choices=[("en", "English"), ("fa", "Persian")], max_length=2)),
                ("name", models.CharField(max_length=200)),
                ("issuer", models.CharField(max_length=200)),
                ("issued_at", models.DateField(blank=True, null=True)),
                ("credential_url", models.URLField(blank=True)),
                ("skills", models.JSONField(blank=True, default=list)),
                ("description", models.TextField(blank=True)),
                ("is_featured", models.BooleanField(default=False)),
                ("order", models.PositiveSmallIntegerField(default=0)),
            ],
            options={
                "ordering": ["-is_featured", "-issued_at", "order"],
            },
        ),
    ]
