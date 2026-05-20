# RepoFleet AI Standard Makefile (Python)
.PHONY: run test lint build clean

run:
	python -m app.main || python main.py || uvicorn app.main:app --reload

test:
	pytest || python -m unittest discover

lint:
	flake8 . || black --check .

build:
	python -m compileall .

clean:
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type f -name "*.pyc" -delete
