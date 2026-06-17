from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_article"),
    ]

    operations = [
        migrations.AddField(
            model_name="article",
            name="cover_image_thumb",
            field=models.ImageField(blank=True, upload_to="articles/thumbs/"),
        ),
        migrations.AddField(
            model_name="project",
            name="cover_image_thumb",
            field=models.ImageField(blank=True, upload_to="projects/thumbs/"),
        ),
    ]
