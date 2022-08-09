# Generated by Django 4.1 on 2022-08-09 21:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api_server", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="comment",
            name="active",
        ),
        migrations.AlterField(
            model_name="comment",
            name="created",
            field=models.DateTimeField(auto_now=True, verbose_name="Created"),
        ),
        migrations.AlterField(
            model_name="post",
            name="created",
            field=models.DateTimeField(verbose_name="Created"),
        ),
        migrations.AlterField(
            model_name="post",
            name="updated",
            field=models.DateTimeField(auto_now=True, verbose_name="Updated"),
        ),
    ]
