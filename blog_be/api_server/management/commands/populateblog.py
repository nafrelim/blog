from api_server.utils import create_admin, create_posts
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    help = "Populates blog with posts"

    def add_arguments(self, parser):
        parser.add_argument("new_number_of_views", nargs="+", type=int)

    def handle(self, *args, **options):
        create_admin()
        create_posts(options["new_number_of_views"][0])
        self.stdout.write(
            self.style.SUCCESS(
                f"Succesfully blog with {options['new_number_of_views'][0]} posts"
            )
        )
