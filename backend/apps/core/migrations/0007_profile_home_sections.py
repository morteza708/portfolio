from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0006_profile_avatar"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="activity_summary_image",
            field=models.ImageField(blank=True, upload_to="profiles/summary/"),
        ),
        migrations.AddField(
            model_name="profile",
            name="activity_summary_text",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="profile",
            name="activity_summary_title",
            field=models.CharField(blank=True, max_length=180),
        ),
        migrations.AddField(
            model_name="profile",
            name="hero_primary_cta",
            field=models.CharField(blank=True, max_length=80),
        ),
        migrations.AddField(
            model_name="profile",
            name="hero_secondary_cta",
            field=models.CharField(blank=True, max_length=80),
        ),
    ]
