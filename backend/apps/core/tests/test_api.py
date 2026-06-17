from django.core.cache import cache
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.core.throttles import ContactRateThrottle
from apps.core.views import ContactCreateView

TEST_CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "portfolio-test-cache",
    }
}


@override_settings(CACHES=TEST_CACHES)
class ContactAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("contact-create")
        cache.clear()

    def test_contact_message_created(self):
        response = self.client.post(
            self.url,
            {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "subject": "Project inquiry",
                "message": "I would like to discuss a remote backend role.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["detail"], "Message received successfully.")

    def test_contact_message_rejects_short_message(self):
        response = self.client.post(
            self.url,
            {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "subject": "Hi",
                "message": "Too short",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("message", response.data)

    def test_contact_view_uses_rate_limiter(self):
        self.assertIn(ContactRateThrottle, ContactCreateView.throttle_classes)


@override_settings(CACHES=TEST_CACHES)
class LanguageRoutingTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_invalid_language_returns_404(self):
        response = self.client.get("/api/v1/xx/projects/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
