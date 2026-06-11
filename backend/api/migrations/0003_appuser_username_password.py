from django.db import migrations, models


def clear_legacy_users(apps, schema_editor):
    AppUser = apps.get_model("api", "AppUser")
    AppUser.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_appuser_emailotp"),
    ]

    operations = [
        migrations.RunPython(clear_legacy_users, migrations.RunPython.noop),
        migrations.AddField(
            model_name="appuser",
            name="username",
            field=models.CharField(default="legacy_user", max_length=30, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="appuser",
            name="password",
            field=models.CharField(default="", max_length=128),
            preserve_default=False,
        ),
    ]
