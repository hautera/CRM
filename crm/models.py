from django.db import models
from django.core.validators import RegexValidator
from . import settings
# Create your models here.

class Address(models.Model):
	ln1 = models.CharField(max_length=50, default="", blank=True)
	ln2 = models.CharField(max_length=15, default="", blank=True)
	city = models.CharField(max_length=20, default='Seattle', blank=True)
	state = models.CharField(max_length=2, default='WA', blank=True)
	postal_code = models.CharField(max_length=5, default='98105', blank=True)


class Customer(models.Model):
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    email = models.EmailField()
    phone_number = models.CharField(max_length=12, validators=[RegexValidator(regex=r'^\d{3}-\d{3}-\d{4}$')],) #TODO validation of phone numbers
    address = models.ForeignKey(Address, related_name='address', on_delete=models.CASCADE)
    referred_by = models.CharField(max_length=2, choices=settings.referred_by_options)


class Ticket(models.Model):
    number = models.IntegerField(unique=True, primary_key=True)
    title = models.CharField(max_length=50)
    device = models.CharField(max_length=50)
    status = models.CharField(max_length=2, choices=settings.status_options)
    primary_contact = models.ForeignKey(Customer, related_name='customer', on_delete=models.CASCADE)

class TicketComment(models.Model):
    timestamp = models.DateTimeField()
    content = models.CharField(max_length=1000)
    #TODO add comment author using user 