from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from .models import Center

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/admin/'):
            return self.get_response(request)

        host = request.META['HTTP_HOST'].split(':')[0]
        parts = host.split('.')

        subdomain = parts[0] if len(parts) > 2 else None

        if subdomain in ['localhost', '127.0.0.1', 'cimssante', 'www'] or subdomain is None:
            request.tenant = None
            return self.get_response(request)

        try:
            request.tenant = Center.objects.get(sub_domain=subdomain)
        except ObjectDoesNotExist:
            raise Http404("Center not found for this subdomain")

        return self.get_response(request)
