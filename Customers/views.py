from django.shortcuts import render
from rest_framework import generics, viewsets, filters
from .serializers import CustomerSerializer
from .models import Customer
from django.views.decorators.csrf import ensure_csrf_cookie

class CustomerRUDView(generics.RetrieveUpdateDestroyAPIView, viewsets.ViewSet):
    lookup_field= 'pk'
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class CustomerLCView(generics.ListCreateAPIView, viewsets.ViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('first_name', 'last_name', 'email', 'phone_number',)


def index(request):
    return render(request, 'Customers/index.html')

@ensure_csrf_cookie 
def create(request):
	return render(request, 'Customers/create.html')

@ensure_csrf_cookie
def customer(request, customer_id):
	return render(request, 'Customers/customer.html')