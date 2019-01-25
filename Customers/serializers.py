from rest_framework import serializers
from .models import Customer, Address

class AddressSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Address
		fields = ('ln1','ln2','city','state','postal_code')
		extra_kwargs= {'ln2': {'allow_blank': True}}

class CustomerSerializer(serializers.HyperlinkedModelSerializer):
	address = AddressSerializer(many=False, read_only=False)
		

	class Meta():
		model = Customer
		fields = ('pk','first_name', 'last_name', 'email', 'phone_number', 'referred_by', 'address',)

	def create(self, validated_data):
		address = validated_data.pop('address')
		address = Address.objects.create(**address)
		return Customer.objects.create(address=address, **validated_data)

	def update(self, instance, validated_data):
		instance.first_name = validated_data.get('first_name', instance.first_name)
		instance.last_name = validated_data.get('last_name', instance.last_name)
		instance.email = validated_data.get('email', instance.email)
		instance.phone_number = validated_data.get('phone_number', instance.phone_number)
		instance.referred_by = validated_data.get('referred_by', instance.referred_by)
		address_data = validated_data.pop('address')
		address = instance.address
		address.ln1 = address_data.get('ln1')
		address.ln2 = address_data.get('ln2')
		address.city = address_data.get('city')
		address.postal_code = address_data.get('postal_code')
		address.state = address_data.get('state')
		address.save()
		instance.save()
		return instance