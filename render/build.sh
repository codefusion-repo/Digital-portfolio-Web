#!//bin/bash

# exit on error
set -o errexit

pip install --upgrade pip

pip install -r server/requirements.txt

python server/manage.py collectstatic --no-input

# python manage.py makemigrations

# python manage.py migrate

# python build.py