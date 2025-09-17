"""
Middleware to disable caching across the entire project.

Adds headers to prevent browsers and intermediaries from caching any responses,
including static assets like CSS and JavaScript during development.
"""

from typing import Callable
from django.http import HttpRequest, HttpResponse


class NoCacheMiddleware:
    """Sets headers to disable caching for all responses."""

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        response = self.get_response(request)

        # Strongly discourage any form of caching by clients or proxies
        response["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response["Pragma"] = "no-cache"
        response["Expires"] = "0"

        # Remove validators that might enable conditional requests
        if "ETag" in response:
            del response["ETag"]
        if "Last-Modified" in response:
            del response["Last-Modified"]

        return response


