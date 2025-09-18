from django.urls import path
from .views import HomeView, ContactView, OurWorkView, VisionView, AboutView, BlogsPressView, BlogDetailView, ContactSubmitView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('api/contact/submit/', ContactSubmitView.as_view(), name='contact_submit'),
    path('our-work/', OurWorkView.as_view(), name='our_work'),
    path('vision/', VisionView.as_view(), name='vision'),
    path('about/', AboutView.as_view(), name='about'),
    path('blogs-press/', BlogsPressView.as_view(), name='blogs_press'),
    path('blogs/<int:pk>/', BlogDetailView.as_view(), name='blog_detail'),
    ]