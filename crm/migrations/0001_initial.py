# Generated by Django 2.1.4 on 2019-01-28 19:50

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ln1', models.CharField(default='', max_length=50)),
                ('ln2', models.CharField(default=' ', max_length=15)),
                ('city', models.CharField(default='Seattle', max_length=20)),
                ('state', models.CharField(default='WA', max_length=2)),
                ('postal_code', models.CharField(default='98105', max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=40)),
                ('last_name', models.CharField(max_length=40)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=12, validators=[django.core.validators.RegexValidator(regex='^\\d{3}-\\d{3}-\\d{4}$')])),
                ('referred_by', models.CharField(choices=[('AA', 'Apple Appointment'), ('AR', 'Apple Recommendation'), ('IS', 'Internet Search')], max_length=2)),
                ('address', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='address', to='crm.Address')),
            ],
        ),
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('number', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(max_length=50)),
                ('device', models.CharField(max_length=50)),
                ('status', models.CharField(choices=[('n', 'New'), ('dq', 'Diagnosed/Need Quote'), ('wc', 'Waiting on Customer'), ('ap', 'Approved'), ('op', 'Need to order parts'), ('ip', 'In Progress'), ('wp', 'Waiting for pickup'), ('rs', 'Resolved'), ('rc', 'Recycle')], max_length=2)),
                ('primary_contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer', to='crm.Customer')),
            ],
        ),
        migrations.CreateModel(
            name='TicketComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField()),
                ('content', models.CharField(max_length=1000)),
            ],
        ),
    ]
