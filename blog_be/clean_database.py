import os
import sys

from apscheduler.schedulers.blocking import BlockingScheduler
from django.core.management import execute_from_command_line

sched = BlockingScheduler()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blog_be.settings")


@sched.scheduled_job("interval", id="clean", days=2)
def flush_tokens():
    print("Cleaning...")
    execute_from_command_line([sys.argv[0], "flushexpiredtokens"])
    execute_from_command_line([sys.argv[0], "silk_clear_request_log"])


sched.start()
