from multiprocessing import cpu_count
from os import environ


from apscheduler.schedulers import blocking

import blog_be


def max_workers():    
    return cpu_count()


bind = '0.0.0.0:' + environ.get('PORT', '8000')
max_requests = 1000
worker_class = 'sync'
workers = max_workers() + 1
timeout = 60
errorlog = '-'
loglevel = 'info'
accesslog = '-'
relode = True
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'
