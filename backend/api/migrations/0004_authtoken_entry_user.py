import django.db.models.deletion
from django.db import migrations, models


def clear_orphan_entries(apps, schema_editor):
    Entry = apps.get_model("api", "Entry")
    Entry.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_appuser_username_password"),
    ]

    operations = [
        migrations.CreateModel(
            name="AuthToken",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(db_index=True, max_length=64, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="tokens", to="api.appuser"),
                ),
            ],
        ),
        migrations.AddField(
            model_name="entry",
            name="user",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="entries",
                to="api.appuser",
            ),
        ),
        migrations.RunPython(clear_orphan_entries, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="entry",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="entries",
                to="api.appuser",
            ),
        ),
    ]
