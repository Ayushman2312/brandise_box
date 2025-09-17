from django.contrib import admin
from .models import BlogPress


@admin.register(BlogPress)
class BlogPressAdmin(admin.ModelAdmin):
    list_display = ("title", "accent", "created_at")
    search_fields = ("title", "subtitle", "main_content")
    list_filter = ("created_at",)
