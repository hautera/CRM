from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index),
    path('<int:customer_id>', views.customer),
    path('create', views.create),
]
