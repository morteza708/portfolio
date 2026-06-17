from io import BytesIO
from pathlib import Path

from django.core.files.base import ContentFile
from PIL import Image, ImageOps

MAX_WIDTH = 1600
THUMB_WIDTH = 640
JPEG_QUALITY = 85


def _to_jpeg(image: Image.Image) -> ContentFile:
    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    buffer.seek(0)
    return ContentFile(buffer.read())


def _resize(image: Image.Image, max_width: int) -> Image.Image:
    if image.width <= max_width:
        return image.copy()

    ratio = max_width / image.width
    size = (max_width, max(1, round(image.height * ratio)))
    return image.resize(size, Image.Resampling.LANCZOS)


def optimize_cover_images(instance) -> None:
    if getattr(instance, "_processing_image", False):
        return

    image_field = instance.cover_image
    if not image_field:
        if instance.cover_image_thumb:
            instance.cover_image_thumb.delete(save=False)
            instance.cover_image_thumb = None
            instance.save(update_fields=["cover_image_thumb"])
        return

    instance._processing_image = True
    try:
        with image_field.open() as file_obj:
            image = Image.open(file_obj)
            image = ImageOps.exif_transpose(image)

            if image.mode in ("RGBA", "P", "LA"):
                image = image.convert("RGB")

            main_image = _resize(image, MAX_WIDTH)
            thumb_image = _resize(image, THUMB_WIDTH)

            original = Path(image_field.name)
            main_name = f"{original.stem}.jpg"
            thumb_name = f"{original.stem}_thumb.jpg"

            instance.cover_image.save(main_name, _to_jpeg(main_image), save=False)
            instance.cover_image_thumb.save(
                thumb_name,
                _to_jpeg(thumb_image),
                save=False,
            )
            instance.save(update_fields=["cover_image", "cover_image_thumb"])
    finally:
        instance._processing_image = False
