"""
URL configuration for Hemo project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.contrib.auth.views import LoginView, LogoutView
from Hemo.views import (add_center , list_centers , superadmin_center_detail , add_center_staff,AddCenterAPIView , SuperAdminLoginAPIView ,
     CheckSubdomainAPIView,CenterListAPIView,GovernorateListAPIView,DelegationListAPIView
) 
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',TemplateView.as_view(template_name='index.html')),
    path('login/', LoginView.as_view(template_name='centers/login.html'), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),


    path('centers/', include('centers.urls')),


    path('api/add-center/', AddCenterAPIView.as_view(), name='add-center'),
    path('api/superadmin-login/', SuperAdminLoginAPIView.as_view(), name='superadmin-login'),
    path('api/check-subdomain/', CheckSubdomainAPIView.as_view(), name='check-subdomain'),
    path('api/centers/', CenterListAPIView.as_view(), name='center-list'),
    path('api/governorates/', GovernorateListAPIView.as_view(), name='governorate-list'),
    path('api/delegations/', DelegationListAPIView.as_view(), name='delegation-list'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

