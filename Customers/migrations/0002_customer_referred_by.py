# Generated by Django 2.1.4 on 2019-01-13 19:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Customers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='referred_by',
            field=models.CharField(choices=[('Apple Appointment', 'AA'), ('Apple Recommendation', 'AR'), ('Internet Search', 'IS')], default='AR', max_length=2),
            preserve_default=False,
        ),
    ]
