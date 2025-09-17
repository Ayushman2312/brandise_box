from django.shortcuts import render
from django.views.generic import TemplateView, DetailView
from .models import BlogPress
import re

class HomeView(TemplateView):
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context[""] = 
        return context
    

class ContactView(TemplateView):
    template_name = 'contact.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class OurWorkView(TemplateView):
    template_name = 'our_work.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class VisionView(TemplateView):
    template_name = 'vision.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class AboutView(TemplateView):
    template_name = 'about.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class BlogsPressView(TemplateView):
    template_name = 'blogs_press.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["blogs"] = BlogPress.objects.all()
        return context
        context["blogs"] = BlogPress.objects.all()
        return context


class BlogDetailView(DetailView):
    model = BlogPress
    template_name = 'blog_detail.html'
    context_object_name = 'blog'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        raw_content = self.object.main_content or ""
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", raw_content) if p.strip()]
        if paragraphs:
            context["first_paragraph"] = paragraphs[0]
            context["rest_paragraphs"] = paragraphs[1:]
        else:
            context["first_paragraph"] = ""
            context["rest_paragraphs"] = []
        return context