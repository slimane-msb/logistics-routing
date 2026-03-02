
NPM = npm
VITE = npx vite

all: install dev

install:
	$(NPM) install

dev:
	$(VITE) --open

build:
	$(NPM) run build

preview:
	$(VITE) preview

deploy:
	$(NPM) run deploy

clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf .vite

rebuild: clean install dev

.PHONY: all install dev build preview clean rebuild