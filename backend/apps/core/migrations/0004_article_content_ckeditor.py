# Generated manually for CKEditor5Field on Article.content

from django.db import migrations
import django_ckeditor_5.fields


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0003_cover_image_thumb"),
    ]

    operations = [
        migrations.AlterField(
            model_name="article",
            name="content",
            field=django_ckeditor_5.fields.CKEditor5Field(verbose_name="Content"),
        ),
    ]
