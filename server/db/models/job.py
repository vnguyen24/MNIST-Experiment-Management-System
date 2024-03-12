from mongoengine import *
import datetime

class Job(Document):
  epochs = IntField(required=True, default=5, min_value=1, max_value=9999) # no limit to max_value, but heavily discouraged to put a big number, enforce max_value in the Frontend/Backend
  learning_rate = FloatField(required=True, default=0.003, min_value=0, max_value=1) # min_value MUST > 0, enforce min_value in the Frontend/ Backend!
  batch_size = IntField(required=True, default=64, min_value=1) # Enforce max_value in the Backend!
  status = BooleanField(default=False, choices=[True, False]) # True for Done, False for Pending
  time_created = ComplexDateTimeField(default=datetime.datetime.now(datetime.UTC))
  time_finished = ComplexDateTimeField(default=None)
  run_time = FloatField(default=None)
  accuracy = FloatField(default=None)

  @classmethod
  def create_or_get_job(cls, epochs, learning_rate, batch_size):
      job = cls.objects(epochs=epochs, learning_rate=learning_rate, batch_size=batch_size).first()
      if job:
          print("A job with this configuration already exists.")
          return "A job with this configuration already exists.", job  # Return the existing job
      else:
          # Create a new job with additional kwargs if needed
          new_job = cls(epochs=epochs, learning_rate=learning_rate, batch_size=batch_size)
          new_job.save()  # Don't forget to call save() to persist the new job
          return "Created new job.", new_job