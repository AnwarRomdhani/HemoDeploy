# centers/middleware.py
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from .models import Center

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip middleware for Django admin interface
        if request.path.startswith('/admin/'):
            return self.get_response(request)

        # Extract the hostname, ignoring the port if present
        host = request.META['HTTP_HOST'].split(':')[0]

        # Define root domains (no subdomain logic applied)
        root_domains = ['localhost', '127.0.0.1', 'https://cims-8a3d5cead720.herokuapp.com','cims-8a3d5cead720.herokuapp.com']
        if host in root_domains:
            request.tenant = None
            return self.get_response(request)

        # Split host into parts to extract subdomain
        parts = host.split('.')
        subdomain = parts[0] if len(parts) > 3 else None

        if subdomain:
            try:
                request.tenant = Center.objects.get(sub_domain=subdomain)
            except ObjectDoesNotExist:
                raise Http404("Center not found for this subdomain")
        else:
            request.tenant = None

        return self.get_response(request)
