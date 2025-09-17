from django.db import models


class BlogPress(models.Model):
    """Blogs & Press entry.

    Minimal fields requested by the user plus an optional cover image to show
    on the left of the detail page. A timestamp is included for sensible
    ordering in listings.
    """

    title = models.CharField(max_length=255)
    accent = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=500, blank=True)
    main_content = models.TextField()
    cover_image = models.ImageField(upload_to='blogs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:  # type: ignore[override]
        return self.title
