.PHONY: install test lint clean run dev build

install:
	pip install -r requirements.txt
	cd frontend && npm install

test:
	pytest tests/ -v

lint:
	ruff check .
	cd frontend && npm run lint 2>/dev/null || true

build:
	python -m compileall .

clean:
	rm -rf __pycache__ .pytest_cache build dist *.egg-info
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	rm -rf frontend/node_modules frontend/dist

run:
	cd backend && uvicorn app.main:app --reload

dev:
	cd frontend && npm run dev
