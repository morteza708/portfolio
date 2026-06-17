# Generated manually for CKEditor5Field on Project.description

from django.db import migrations
import django_ckeditor_5.fields


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0004_article_content_ckeditor"),
    ]

    operations = [
        migrations.AlterField(
            model_name="project",
            name="description",
            field=django_ckeditor_5.fields.CKEditor5Field(
                blank=True,
                verbose_name="Description",
            ),
        ),
    ]
