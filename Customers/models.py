from django.db import models
from django.core.validators import RegexValidator
from . import settings
# Create your models here.



#TODO Address model/serializer
class Address(models.Model):
	ln1 = models.CharField(max_length=50, default="")
	ln2 = models.CharField(max_length=15, default=" ")
	city = models.CharField(max_length=20, default='Seattle')
	state = models.CharField(max_length=2, default='WA')
	postal_code = models.CharField(max_length=5, default='98105')


class Customer(models.Model):
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    email = models.EmailField()
    phone_number = models.CharField(max_length=12, validators=[RegexValidator(regex=r'^\d{3}-\d{3}-\d{4}$')],) #TODO validation of phone numbers
    address = models.ForeignKey(Address, related_name='address', on_delete=models.CASCADE)
    referred_by = models.CharField(max_length=2, choices=settings.referred_by_options)