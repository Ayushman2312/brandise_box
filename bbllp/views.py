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
        # Support both JSON and multipart/form-data submissions
        content_type = (request.META.get('CONTENT_TYPE') or '').lower()
        if 'application/json' in content_type:
            try:
                payload = json.loads(request.body.decode('utf-8'))
            except Exception:
                return JsonResponse({'ok': False, 'message': 'Invalid request body'}, status=400)
            name = (payload.get('name') or '').strip()
            email = (payload.get('email') or '').strip()
            phone = (payload.get('phone') or '').strip()
            topics = payload.get('topics') or []
            message = (payload.get('message') or '').strip()
            resume_file = None
        else:
            name = (request.POST.get('name') or '').strip()
            email = (request.POST.get('email') or '').strip()
            phone = (request.POST.get('phone') or '').strip()
            # topics may arrive as JSON string
            raw_topics = request.POST.get('topics')
            try:
                topics = json.loads(raw_topics) if raw_topics else []
            except Exception:
                topics = [t.strip() for t in (raw_topics or '').split(',') if t.strip()]
            message = (request.POST.get('message') or '').strip()
            resume_file = request.FILES.get('resume')

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
            # Attach resume when Career is selected and file provided
            if any(str(t).strip().lower() == 'career' for t in (topics or [])):
                # Enforce presence for career
                if resume_file is None:
                    return JsonResponse({'ok': False, 'message': 'Resume is required for Career inquiries.'}, status=400)
                # Basic validation: size <= 5MB, allowed extensions
                allowed_ext = {'.pdf', '.doc', '.docx', '.rtf', '.txt'}
                filename = getattr(resume_file, 'name', 'resume')
                import os
                ext = os.path.splitext(filename)[1].lower()
                if ext not in allowed_ext:
                    return JsonResponse({'ok': False, 'message': 'Unsupported resume format. Allowed: PDF, DOC, DOCX, RTF, TXT.'}, status=400)
                max_bytes = 5 * 1024 * 1024
                if getattr(resume_file, 'size', 0) > max_bytes:
                    return JsonResponse({'ok': False, 'message': 'Resume file is too large (max 5MB).'}, status=400)
                # Guess content type
                content_type = 'application/octet-stream'
                if ext == '.pdf':
                    content_type = 'application/pdf'
                elif ext in {'.doc', '.docx'}:
                    content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                elif ext == '.rtf':
                    content_type = 'application/rtf'
                elif ext == '.txt':
                    content_type = 'text/plain'
                msg.attach(filename, resume_file.read(), content_type)
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