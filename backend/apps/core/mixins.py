import os

from django.core.cache import cache
from rest_framework.response import Response

from .cache import CACHE_TTL, get_cached, list_cache_key, set_cached, api_cache_key


class CachedAPIViewMixin:
    cache_namespace = ""
    cache_ttl = CACHE_TTL

    def get_cache_key(self) -> str | None:
        raise NotImplementedError

    def add_cache_headers(self, response: Response) -> Response:
        response["Cache-Control"] = f"public, max-age={self.cache_ttl}, s-maxage={self.cache_ttl}"
        return response

    def build_response_from_cache(self, cached_data):
        return self.add_cache_headers(Response(cached_data))

    def cache_response_data(self, cache_key: str, data) -> None:
        set_cached(cache_key, data, self.cache_ttl)

    def get_list_cache_key(self) -> str:
        language = self.kwargs["language"]
        page = self.request.query_params.get("page", "1")
        return list_cache_key(self.cache_namespace, language, page)

    def list(self, request, *args, **kwargs):
        cache_key = self.get_list_cache_key()
        cached = get_cached(cache_key)
        if cached is not None:
            return self.build_response_from_cache(cached)

        response = super().list(request, *args, **kwargs)
        if response.status_code == 200:
            self.cache_response_data(cache_key, response.data)
            self.add_cache_headers(response)
        return response

    def retrieve(self, request, *args, **kwargs):
        cache_key = self.get_cache_key()
        if cache_key:
            cached = get_cached(cache_key)
            if cached is not None:
                return self.build_response_from_cache(cached)

        response = super().retrieve(request, *args, **kwargs)
        if response.status_code == 200 and cache_key:
            self.cache_response_data(cache_key, response.data)
            self.add_cache_headers(response)
        return response
