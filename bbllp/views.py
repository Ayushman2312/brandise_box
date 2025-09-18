from django.shortcuts import render
from django.views.generic import TemplateView, DetailView, View
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import BlogPress
import re
import json

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


class ContactSubmitView(View):
    def post(self, request, *args, **kwargs):
        try:
            payload = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse({'ok': False, 'message': 'Invalid request body'}, status=400)

        name = (payload.get('name') or '').strip()
        email = (payload.get('email') or '').strip()
        phone = (payload.get('phone') or '').strip()
        topics = payload.get('topics') or []
        message = (payload.get('message') or '').strip()

        # Basic validation
        if not name or not email or not phone or not message:
            return JsonResponse({'ok': False, 'message': 'All required fields must be filled.'}, status=400)
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
            return JsonResponse({'ok': False, 'message': 'Please provide a valid email.'}, status=400)
        if not re.match(r"^\d{10}$", phone):
            return JsonResponse({'ok': False, 'message': 'Please provide a valid 10-digit phone.'}, status=400)

        to_email = 'brandisebox@gmail.com'
        subject = 'New Contact Lead — Brandise Box'

        context = {
            'name': name,
            'email': email,
            'phone': phone,
            'topics': topics,
            'message': message,
            'site_name': 'Brandise Box',
        }

        html_content = render_to_string('email/contact_lead.html', context)
        text_content = strip_tags(html_content)

        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None) or getattr(settings, 'EMAIL_HOST_USER', '')
        try:
            msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
            msg.attach_alternative(html_content, 'text/html')
            msg.send(fail_silently=False)
        except Exception as e:
            return JsonResponse({'ok': False, 'message': 'Failed to send email. Please try again later.'}, status=500)

        return JsonResponse({'ok': True, 'message': 'Thanks! Your message has been sent.'})


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