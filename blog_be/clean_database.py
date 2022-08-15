import os
import sys

from apscheduler.schedulers.blocking import BlockingScheduler
from django.core.management import execute_from_command_line

sched = BlockingScheduler()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blog_be.settings")

# @sched.scheduled_job('interval', minutes=3)
# def timed_job():
#     print('This job is run every three minutes.')


@sched.scheduled_job("cron", day_of_week="mon, thu", hour=2)
def flush_tokens():
    print("Flushing tokens...")
    execute_from_command_line([sys.argv[0], "flushexpiredtokens"])


@sched.scheduled_job("cron", day_of_week="mon, thu", hour=2)
def silk_clear():
    print("Clearing silk cache...")
    execute_from_command_line([sys.argv[0], "silk_clear_request_log"])


sched.start()
