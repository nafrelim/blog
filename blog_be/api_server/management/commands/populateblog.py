from api_server.utils import create_admin, create_posts
from django.core.management import BaseCommand


class Command(BaseCommand):

    help = "Populates blog with posts"

    def add_arguments(self, parser):
        parser.add_argument("new_number_of_views", nargs="+", type=int)

    def handle(self, *args, **options):
        if options["new_number_of_views"][0] >= 100:
            create_admin()
            create_posts(options["new_number_of_views"][0])
            self.stdout.write(
                self.style.SUCCESS(
                    f"Succesfully blog with {options['new_number_of_views'][0]} posts"
                )
            )
        else:
            self.stdout.write(
                self.style.ERROR(f"Too few posts! You must enter 100 or more.")
            )
