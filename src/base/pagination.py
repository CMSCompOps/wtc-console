from rest_framework import pagination
from rest_framework.response import Response

class CustomPagination(pagination.PageNumberPagination):
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response({
            'current': self.page.number,
            'pages': self.page.paginator.num_pages,
            'total': self.page.paginator.count,
            'results': data
        })